<template>
  <div>
    <router-view></router-view>
  </div>
</template>
<script lang="ts" setup></script>

<route>
  {
    "name": "admin",
    "path": "/admin",
    "meta": {
      "layout": "default",
      "admin": true,
      "auth": true
    }
  }
</route>
