<template>
  <div>
    <TransitionRoot as="template" :show="formIsOpen">
      <Dialog as="div" class="relative z-10" @close="$emit('close-form')">
        <TransitionChild
        as="template"
        enter="ease-out duration-300"
        enter-from="opacity-0"
        enter-to="opacity-100"
        leave="ease-in duration-200"
        leave-from="opacity-100"
        leave-to="opacity-0"
        >
          <div class="fixed inset-0 bg-stone-500 bg-opacity-25 transition-opacity"></div>
        </TransitionChild>

        <div class="fixed inset-0 z-10 overflow-y-auto">
          <div class="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
            <TransitionChild
            as="template"
            enter="ease-out duration-300"
            enter-from="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
            enter-to="opacity-100 translate-y-0 sm:scale-100"
            leave="ease-in duration-200"
            leave-from="opacity-100 translate-y-0 sm:scale-100"
            leave-to="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
            >
              <DialogPanel :class="[widthClasses, 'overflow-hidden rounded-lg shadow-xl sm:my-8 bg-stone-200 dark:bg-stone-900']">
                <div class="flex items-end justify-start px-10 gap-4">
                  <div class="flex items-center justify-around h-12 w-12 rounded-full bg-stone-100 dark:bg-stone-800 text-stone-500 shadow-sm shadow-stone-400">
                    <component :is="icon" class="h-8 w-8" aria-hidden="true" />
                  </div>
                  <div>
                    <h3 class="text-lg font-bold text-center mt-8">
                      {{ title }}
                    </h3>
                    <p class="text-sm text-center">
                      {{ subtitle }}
                    </p>
                  </div>
                </div>
                <div aria-hidden="true">
                  <div class="my-3">
                    <div class="mx-10 border-t border-stone-400 dark:border-white" />
                  </div>
                </div>
                  <slot></slot>
              </DialogPanel>
            </TransitionChild>
          </div>
        </div>
      </Dialog>
    </TransitionRoot>
  </div>
</template>

<script setup>
import { Dialog, DialogPanel, TransitionChild, TransitionRoot } from '@headlessui/vue'

const props = defineProps({
  formIsOpen: {
    type: Boolean,
    default: false,
  },
  icon: {
    required: true,
  },
  title: {
    type: String,
  },
  subtitle: {
    type: String,
  },
  widthClasses: {
    type: String,
    default: 'w-96 2xl:w-1/4',
  }
})
const emit = defineEmits(['close-form'])
</script>