<script setup lang="ts">
const surround = [{
  title: 'ContentNavigation',
  path: '/components/content-navigation',
  description: 'A navigation component for displaying a list of links.'
}, {
  title: 'ContentToc',
  path: '/components/content-toc',
  description: 'A table of contents component for displaying a list of links.'
}]
</script>

<template>
  <Navbar />

  <UContentSurround :surround="surround" />
</template>
