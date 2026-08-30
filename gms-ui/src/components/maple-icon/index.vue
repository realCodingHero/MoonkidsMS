<template>
  <img
    v-bind="$attrs"
    :src="currentUrl"
    @error="handleImageError"
  />
</template>

<script lang="ts" setup>
  import { computed, ref, watch } from 'vue';
  import {
    getIconUrl,
    getResourceInfoUrl,
  } from '@/utils/mapleStoryAPI';

  const props = withDefaults(
    defineProps<{
      category: string;
      id: string | number;
      location?: string;
      primaryVersion?: string;
      fallbackVersion?: string;
    }>(),
    {
      location: 'GMS',
      primaryVersion: '83',
      fallbackVersion: '186',
    }
  );

  const primaryUrl = computed(() =>
    getIconUrl(
      props.category,
      props.id,
      props.location,
      props.primaryVersion
    )
  );
  const fallbackUrl = computed(() =>
    getIconUrl(
      props.category,
      props.id,
      props.location,
      props.fallbackVersion
    )
  );
  const primaryInfoUrl = computed(() =>
    getResourceInfoUrl(
      props.category,
      props.id,
      props.location,
      props.primaryVersion
    )
  );
  const currentUrl = ref('');
  const fallbackTried = ref(false);

  watch(
    primaryUrl,
    (url) => {
      currentUrl.value = url;
      fallbackTried.value = false;
    },
    { immediate: true }
  );

  const handleImageError = async () => {
    if (fallbackTried.value || !primaryUrl.value) return;

    // MapleStory.io omits CORS headers on icon 404 responses, so the browser
    // cannot read the icon status directly. Its metadata endpoint returns
    // CORS-readable null for the same missing resource.
    try {
      const response = await fetch(primaryInfoUrl.value, {
        method: 'GET',
        cache: 'force-cache',
      });
      if (response.status === 404) {
        fallbackTried.value = true;
        currentUrl.value = fallbackUrl.value;
        return;
      }
      if (!response.ok || (await response.json()) !== null) return;
    } catch {
      return;
    }

    fallbackTried.value = true;
    currentUrl.value = fallbackUrl.value;
  };
</script>
