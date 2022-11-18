<script>
  import Vote from './Vote.svelte'
  import Reactions from './Reactions.svelte'
  import Tags from './Tags.svelte'
  import Reply from './Reply.svelte'
	// let heading = fetch();
  export let content;
</script>
  
<div class="post">
	<Vote />
	<h3 class="phead">{content}</h3>
	<p class="content">This is our content.</p>
	<Reactions />
	<Tags />
	<Reply />
</div>
 
<style>
  .post {
	background-color: #ddd;
	color: #000;
	border-radius: 5px;
	padding: 20px;
	font-size: 150%;
  }
</style>
