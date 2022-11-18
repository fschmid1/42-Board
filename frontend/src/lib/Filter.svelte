<script lang="ts">
    import { filterStore } from "../stores";

    export let selected = 'votes'

</script>

<p>Filter by</p>
<select bind:value={selected} on:change="{() => filterStore.set(selected) }">>
    <option value="votes">Vote</option>
    <option value="ts">New</option>
</select>

<style>
    select {
        border-radius: 8px;
        border: 1px solid transparent;
        width: 80px;
        background-color: transparent;
    }

    p {
        color: rgba(255, 255, 255, 0.87);
        font-size: 14px;
        margin-left: 1em;
    }
</style>