<template>
  <div class="tabItem" @click="onClickTab(tabItem.categoryId)">
    {{ tabItem.categoryName }}
    <span class="cnt"> {{ tabItem.categoryLinkCnt }}</span>
  </div>
</template>
<script>
export default {
  name: "TabItem",
  props: {
    tabItem: {
      type: Object,
      default: () => {
        return {
          categoryId: 0,
          categoryName: "",
          categoryLinkCnt: 0,
        };
      },
    },
  },
  methods: {
    onClickTab(id) {
      this.$emit("categoryId", id);
    },
  },
};
</script>
<style scoped>
.tabItem {
  color: var(--gray400);
  padding: 13px 14px;
  font-size: 14px;
  cursor: pointer;
  flex: 0 0 auto;
}
.tabItem .cnt {
  color: var(--gray300);
}
.on {
  border-bottom: 2px solid var(--blue500);
  color: var(--blue500);
}
.on .cnt {
  color: var(--blue500);
}
</style>
