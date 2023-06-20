<script lang=ts>
  //Row component is optional and only serves to render odd/even row, you can use <tr> instead.
  //Sort component is optional
  import { onMount } from "svelte";

  import Table, { Pagination, Row, Search, Sort } from "./Table.svelte";
  import { getAll, getUsers } from "./server.js";
  import { sortNumber, sortString } from "./sorting.js";
  import type { User } from "../../types";
  import { getData } from "./server.js";

  let rows = [];
  let saveRows = [];
  let rowsCount = 0;
  let page = 0; //first page
  let pageSize = 5; //optional, 10 by default

  onMount(async () => {
    rows = await getAll();
    rows = sortNumber(rows, "desc", "mmr");
    saveRows = rows;
  });

  function onCellClick(row) {
    alert(JSON.stringify(row));
  }

  function onSortString(event) {
    event.detail.rows = sortString(
      event.detail.rows,
      event.detail.dir,
      event.detail.key
    );
  }

  function onSortNumber(event) {
    event.detail.rows = sortNumber(
      event.detail.rows,
      event.detail.dir,
      event.detail.key
    );
  }

  function getRank(mmr)
  {
    return 1;
  }

</script>

<Table {page} {pageSize} {rows} let:rows={rows2}>
  <thead slot="head">
    <tr>
      <th>
        Rank
        <Sort key="mmr" on:sort={onSortString} />
      </th>
      <th>
        username
        <Sort key="username" on:sort={onSortString} />
      </th>
      <th>
        elo
        <Sort key="mmr" on:sort={onSortNumber} />
      </th>
      <th>
        games
        <Sort key="games" on:sort={onSortNumber} />
      </th>
    </tr>
  </thead>
  <tbody>
    {#each rows2 as row, index (row)}
      <Row {index} on:click={() => onCellClick(row)}>
        <td data-label="id">{row.id}</td>
        <td data-label="username">{row.username}</td>
        <td data-label="mmr">{row.mmr}</td>
        <td data-label="games">{row.games}</td>
      </Row>
    {/each}
  </tbody>
</Table>