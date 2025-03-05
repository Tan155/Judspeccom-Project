<template>
  <v-container>
    <v-navigation-drawer ref="scrollContainer" class="bg-deep-purple" theme="light" permanent app
      style=" transform: translateY(0px); overflow-y: auto;">
      <v-card class="mt-2 sticky-total" elevation="4">
        <v-list color="transparent">
          <v-list-item title="Total">
            <h4>{{ drawer?.getPrice() }}</h4>
          </v-list-item>
        </v-list>
      </v-card>

      <v-list>
        <v-list-item v-for="(item, index) in drawer?.getMenu()" :key="index">
          <template v-if="(drawer?.getStack(index)?.status === 0)">
            <v-card block class="text-start" @click="products.selectMenu(index)">
              <svg-icon type="mdi" :path="item?.icon" />
              {{ item?.name ?? 'N/A' }}
            </v-card>
          </template>

          <template v-else-if="(drawer?.getStack(index)?.status === 1)">
            <v-card class="bg-deep-purple-lighten-5 cursor-default" @click="products?.selectMenu(index)">
              <v-row>
                <v-col cols="6">
                  <v-img width="50px" :src="drawer?.getStack(index)?.img" />
                </v-col>
                <v-col cols="6">
                  <svg-icon type="mdi" :path="mdiLocationExit" size="40"
                    style="transform: translateX(90%) translateY(20%);" class="cursor-pointer text-red"
                    @click="drawer?.StackPop(index)" />
                </v-col>
              </v-row>
              <v-row>
                <v-card-text>
                  {{ drawer?.getStack(index)?.name }}
                </v-card-text>
              </v-row>
            </v-card>
          </template>
        </v-list-item>
      </v-list>

      <v-container>
        <PDF />
      </v-container>
    </v-navigation-drawer>
  </v-container>
</template>

<script setup>
import { ref } from 'vue';

import { useProductStore } from '@/stores/ProductStore'
import PDF from "@/components/PDF.vue";
import { useDrawer } from "@/stores/DrawerClass";

const drawer = useDrawer();
const productStore = useProductStore()

const products = ref(null);
</script>

<style lang="scss" scoped></style>
