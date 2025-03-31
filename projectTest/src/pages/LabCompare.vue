<template>
  <v-container width="300px">
    <v-row>
      <router-link to="/ToolV1">
        <v-btn block dark style="width: 292px; border-radius: 7px; margin: 20px 0 8px 0;">
          Customize
        </v-btn>
      </router-link>
    </v-row>
    <v-row>
      <v-btn block :style="{ backgroundColor: getOption() === 0 ? '#E64A19' : '#CFD8DC' }" dark @click="setOption(0)">
        Segment
      </v-btn>
    </v-row>
    <v-row>
      <v-btn block :style="{ backgroundColor: getOption() === 1 ? '#E64A19' : '#CFD8DC' }" class="mt-2" dark
        @click="setOption(1)">
        My Computer Set
      </v-btn>
    </v-row>
  </v-container>

  <Suspense v-if="option === 0">
    <!--ถ้ามี await-->
    <v-container>
      <compareSegment ref="compareSegmentRef" />
    </v-container>
  </Suspense>
  <Suspense v-if="option === 1">
    <!--ถ้ามี await-->
    <v-container>
      <compareMyBuild ref="compareMyBuildRef" />
    </v-container>
  </Suspense>
</template>

<script setup>
import { ref } from 'vue';
import compareSegment from '@/components/compareSegment.vue';
import compareMyBuild from '@/components/compareMyBuild.vue';

const compareSegmentRef = ref(null);
const compareMyBuildRef = ref(null);

const option = ref(0);
function setOption(index) {
  option.value = index;
}

function getOption() {
  return option.value;
}
</script>

<style lang="scss" scoped></style>
