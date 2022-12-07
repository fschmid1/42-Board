import { prisma } from '../prisma';
import { Application, Request, Response } from 'express';
import passport from 'passport';
import { isAuthenticatedRest } from '../middlewares/auth.middleware';
import { AUTH_SECRET, AUTH_UID, BACK, FRONT } from '../vars.global';
var FortyTwoStrategy = require('passport-42').Strategy;

export const registerAuthHandler = (app: Application) => {
  app.use(passport.initialize());
  app.use(passport.session());

  passport.use(
    new FortyTwoStrategy(
      {
        clientID: AUTH_UID,
        clientSecret: AUTH_SECRET,
        callbackURL: BACK + '/auth/42/callback'
      },
      (accessToken: string, refreshToken: string, profile: any, cb: (err: any, user: any) => any) => {
        (async () => {
          try {
            let user = await prisma.user.findFirst({
              where: {
                intraId: profile.id
              }
            });
            if (!user) {
              profile = profile._json;

              user = await prisma.user.create({
                data: {
                  intraId: String(profile.id),
                  username: profile.login,
                  displayName: profile.displayname,
                  familyName: profile.last_name,
                  givenName: profile.first_name,
                  profileUrl: profile.url,
                  email: profile.email,
                  phoneNumber: profile.phone,
                  photoUrl: profile.image.versions.small
                }
              });
            }
            if (user.banned) return cb({ status: 400, message: 'Nicht mit mir...' }, null);
            cb(null, user);
          } catch (error) {
            cb(error, null);
          }
        })();
      }
    )
  );

  passport.serializeUser((user: any, done) => {
    done(null, user.intraId);
  });

  passport.deserializeUser(async (id: string, done) => {
    try {
      let user = await prisma.user.findFirst({
        where: {
          intraId: id
        }
      });
      done(null, user);
    } catch (error) {
      done(error, null);
    }
  });

  app.get('/auth/login', passport.authenticate('42'));

  app.post('/auth/logout', (req, res, next) => {
    req.logout(function (err) {
      if (err) {
        return next(err);
      }
      res.redirect('/');
    });
  });

  app.get('/auth/42/callback', passport.authenticate('42', { failureRedirect: '/auth/login' }), function (req, res) {
    res.redirect(FRONT);
  });

  app.get('/auth/status', isAuthenticatedRest, (req: Request, res: Response) => res.send(req.user));
};
