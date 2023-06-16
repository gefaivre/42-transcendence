<script>
  //Row component is optional and only serves to render odd/even row, you can use <tr> instead.
  //Sort component is optional
  import { onMount } from "svelte";
  import Table, { Pagination, Row, Search, Sort } from "./Table.svelte";
  import { getAll } from "./server.js";
  import { sortNumber, sortString } from "./sorting.js";

  let rows = [];
  let rowsCount = 0;
  let page = 0; //first page
  let pageSize = 5; //optional, 10 by default

  onMount(async () => {
    rows = await getAll();
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
    event.detail.rows = sortString(
      event.detail.rows,
      event.detail.dir,
      event.detail.key
    );
  }
  async function load(_page) {
      const data = await getData(_page, pageSize, text, sorting);
      rows = data.rows;
      rowsCount = data.rowsCount;
    }
  
  function onPageChange(event) {
      load(event.detail.page);
          page = event.detail.page;
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
        Name
        <Sort key="Name" on:sort={onSortString} />
      </th>
      <th>
        Age
        <Sort key="age" on:sort={onSortNumber} />
      </th>
    </tr>
  </thead>
  <tbody>
    {#each rows2 as row, index (row)}
      <Row {index} on:click={() => onCellClick(row)}>
        <td data-label="Rank">{(index + 1) + pageSize * page}</td>
        <td data-label="Name">{row.name}</td>
        <td data-label="Age">{row.age}</td>
      </Row>
    {/each}
  </tbody>
</Table>