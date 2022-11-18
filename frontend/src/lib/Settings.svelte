<script lang="ts">
    import { userStore } from "../stores";


</script>

{#if $userStore}
    <div class="row">
        <span>{$userStore.username}</span>
        <div class="avatar" style="background-image: url({$userStore.photo});"></div>
    </div>
   
{/if}


<style>
    .row {
        display: flex;
        align-items: center;
        cursor: pointer;
    }

    span {
        margin-right: 0.5rem;
        font-weight: bold;
        letter-spacing:1px;
    }
    .avatar{
        line-height: 40px;
        box-sizing: border-box;
        background-size: cover !important;
        display: block;
        background-repeat: no-repeat;
        background-position: 50% 50%;
        border-radius: 50%;
        height: 40px;
        width: 40px;
        margin: auto;
        transition: all 0.2 ease;
       
    }

</style>