<script>

	function handleClick() {
		location.replace('http://localhost:8080/auth/login');
	}
</script>

<button on:click={handleClick}>
	Click me
</button>
