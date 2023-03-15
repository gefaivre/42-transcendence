
<script>
    export const title = 'Mon titre';
  </script>
  
  <header>
    <div class="menu">
      {#each menuItems as item, i}
        <a href={item.link}>
          <img class="menu-item-image" src={item.icon} alt={item.label} />
        </a>
      {/each}
    </div>
  
    <div class="logo-container">
      <img class="logo" src={logo} alt="Logo" />
    </div>
  </header>
  
  <main>
    <slot></slot>
  </main>
  