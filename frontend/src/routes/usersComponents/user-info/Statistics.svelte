<script lang="ts">
    import type { Stat } from "../../../types";

  export let statistics: Stat;

</script>

<div class="box-info statistics">
    <!--lOST GAME | WON GAME | TOTAL GAMES | GAME RATINO |
    MMR | AVERAGE SCORE WHEN WIN | AVERAGE SCORE WHEN LOSE-->
    <h1>Statistics</h1>
    <div class="stat-grid">
      <div class="tiles">
        <h2>Total games</h2>
        <div class="value">
          <span>{statistics.totalGames}</span>
        </div>
      </div>
      <div class="tiles lite">
        <h2>Won games</h2>
        <div class="value">
          <span>{statistics.wonGames}</span>
        </div>
      </div>
      <div class="tiles lite">
        <h2>Lost games</h2>
        <div class="value">
          <span>{statistics.lostGames}</span>
        </div>
      </div>
      <div class="tiles">
        <h2>Ratio</h2>
        <div class="value">
          <span>{statistics.ratioGames}</span>
        </div>
      </div>
      <div class="tiles">
        <h2>Average win</h2>
        <div class="value">
          <span>{statistics.averageWin.score}-{statistics.averageWin.opponentScore}</span>
        </div>
      </div>
      <div class="tiles lite">
        <h2>Average lose</h2>
        <div class="value">
          <span>{statistics.averageLose.score}-{statistics.averageLose.opponentScore}</span>
        </div>
      </div>
      <div class="chart">
        <span>chart</span>
      </div>
    </div>
  </div>

<style>

  .box-info h1 {
    height: 40px;
    border-bottom: solid 1px black;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .box-info h1 {
    height: 40px;
  }

  .statistics {
    margin: 50px;
    border: solid 2px var(--grey);
    box-shadow: 0 0 10px var(--lite-grey);
    background-color: var(--lite-grey);
    border-radius: 30px;
    height: 80%;
    width: 80%;
    display: flex;
    flex-direction: column;
  }

  .stat-grid {
    height: 100%;
    display: grid;
    grid-template-columns: 1fr 1fr;
    grid-template-rows: 1fr 1fr 1fr;
  }

  .stat-grid .tiles:last-child {
    border-radius: 0 0 30px 0;
  }

  .stat-grid .lite {
    background-color: var(--lite-lite-grey);
  }

  .stat-grid .tiles {
    position: relative;
  }

  .stat-grid .tiles h2 {
    position: absolute;
    text-align: center;
    color: var(--lite-lite-lite-grey);
  }

  .stat-grid .tiles .value {
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .stat-grid .tiles .value span {
    font-size: 3em;
  }

</style>
