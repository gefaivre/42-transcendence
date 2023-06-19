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
  let users= [];
  let rowsCount = 0;
  let page = 0; //first page
  let pageSize = 5; //optional, 10 by default

  onMount(async () => {
    rows = await getAll();
    users = await getUsers();
    console.log(users);
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

</script>

<Table {page} {pageSize} {rows} let:rows={rows2}>
  <thead slot="head">
    <tr>
      <th>
        Rank
        <Sort key="rank" on:sort={onSortString} />
      </th>
      <th>
        username
        <Sort key="username" on:sort={onSortString} />
      </th>
      <th>
        elo
        <Sort key="mmr" on:sort={onSortNumber} />
      </th>
    </tr>
  </thead>
  <tbody>
    {#each rows2 as row, index (row)}
      <Row {index} on:click={() => onCellClick(row)}>
        <td data-label="id">{row.id}</td>
        <td data-label="username">{row.username}</td>
        <td data-label="Age">{row.mmr}</td>
      </Row>
    {/each}
  </tbody>
</Table>