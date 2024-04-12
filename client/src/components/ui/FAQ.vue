<script setup>
const props = defineProps({
  title: {
    type: String,
    default: ''
  },
  subtitle: {
    type: String,
    default: ''
  },
  faqTerms: {
    type: [],
    default: []
  }
})
</script>
<template>
  <Card class="py-3 px-4 flex-col gap-5 text-white">
    <div class="flex flex-col items-center">
      <h2 class="font-bold text-5xl mt-5 tracking-tight">{{props.title}}</h2>
      <p class="text-neutral-500 text-base mt-3">{{props.subtitle}}</p>
      <div class="mt-5"></div>
    </div>
    <div class="grid divide-y divide-neutral-200 max-w-2xl w-full mx-auto mt-8">
      <div class="py-5 w-full" v-for="(item, i) in props.faqTerms" :key="i">
        <details class="group text-zinc-100">
          <summary class="flex justify-between items-center font-medium cursor-pointer list-none">
            <span>{{ item.title }}</span>
            <span class="transition group-open:rotate-180">
              <svg
                fill="none"
                height="24"
                shape-rendering="geometricPrecision"
                stroke="currentColor"
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="1.5"
                viewBox="0 0 24 24"
                width="24"
              >
                <path d="M6 9l6 6 6-6"></path>
              </svg>
            </span>
          </summary>
          <p class="text-zinc-400 mt-3 group-open:animate-fadeIn">
            {{ item.description }}
          </p>
        </details>
      </div>
    </div>
  </Card>
</template>
