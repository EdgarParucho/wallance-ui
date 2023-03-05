<template>
  <TransitionRoot appear :show="props.formIsOpen" as="template">
    <Dialog as="div" @close="$emit('close-form')" class="relative z-10">
      <TransitionChild
      as="template"
      enter="duration-300 ease-out"
      enter-from="opacity-0"
      enter-to="opacity-100"
      leave="duration-200 ease-in"
      leave-from="opacity-100"
      leave-to="opacity-0"
      >
      <div class="fixed inset-0 bg-black bg-opacity-25" />
      </TransitionChild>
  
      <div class="fixed inset-0 overflow-y-auto">
        <div class="flex min-h-full items-center justify-center p-4 text-center">
          <TransitionChild
          as="template"
          enter="duration-300 ease-out"
          enter-from="opacity-0 scale-95"
          enter-to="opacity-100 scale-100"
          leave="duration-200 ease-in"
          leave-from="opacity-100 scale-100"
          leave-to="opacity-0 scale-95"
          >
            <DialogPanel class="max-w-lg transform overflow-hidden rounded-2xl bg-stone-800 p-6 text-left align-middle shadow-xl transition-all">
              <DialogTitle as="h3" class="text-lg font-bold leading-6 text-white">
                Fund Form
              </DialogTitle>
              <form class="md:flex" @submit.prevent="handleSubmit">
                <div class="w-full md:w-2/6 p-4 md:flex items-center justify-center text-center">
                  <button class="h-24 w-16">
                    <CameraIcon class="text-stone-400 hover:text-white" />
                  </button>
                </div>
                <div class="w-full md:w-4/6 p-4">
                  <div class="h-1/3 w-full">
                    <label for="fund-name" class="text-xs font-semibold">Name</label>
                    <input id="fund-name" class="px-2 text-xl font-bold text-stone-50 mb-2 bg-transparent w-full border-0 border-b focus:outline-0 active:outline-0" v-model="fund.name" placeholder="College">
                  </div>
                  <div class="h-1/3 w-full">
                    <label for="fund-description" class="text-xs font-semibold">Description</label>
                    <textarea id="fund-description" class="text-sm text-stone-200 bg-transparent w-full border-0 border-b focus:outline-0 active:outline-0 focus:ring-0 active:ring-0" v-model="fund.description" placeholder="A creative description"></textarea>
                  </div>
                  <div class="h-1/3 w-full flex items-center justify-end my-4">
                    <button
                    class="text-yellow-400 bg-stone-900 hover:bg-stone-700 focus:ring-2 focus:outline-none focus:ring-stone-600 font-bold rounded-md text-sm px-4 py-2"
                    type="submit"
                    @click.prevent="handleSubmit"
                    >
                      Save
                    </button>
                  </div>
                </div>
              </form>
            </DialogPanel>
          </TransitionChild>
        </div>
      </div>
    </Dialog>
  </TransitionRoot>
</template>
 
<script setup>
import { CameraIcon } from '@heroicons/vue/24/outline'
import { ref, defineEmits } from 'vue'
import { useFundStore } from '../../stores/fundStore';
import {
 TransitionRoot,
 TransitionChild,
 Dialog,
 DialogPanel,
 DialogTitle,
} from '@headlessui/vue'

const props = defineProps(['form-is-open', 'editing-fund'])
const emit = defineEmits(['close-form', 'open-form'])
const fundStore = useFundStore()

const queryInProgress = ref(false)
const fund = ref({
  _id: '',
  usersIDs: [],
  name: '',
  description: '',
  picture: '',
  lastUpdated: new Date().toISOString().slice(0, 10),
  savings: 0,
})

const editing = props.editingFund !== undefined
if(editing) fund.value = { ...props.editingFund };

function resetForm() {
  fund.value = {
    _id: '',
    usersIDs: [],
    name: '',
    description: '',
    picture: '',
    lastUpdated: new Date().toISOString().slice(0, 10),
    savings: 0,
  }
}
function handleSubmit() {
  queryInProgress.value = true
  const queryStatus = editing ? fundStore.editFund(fund.value) : fundStore.addFund(fund.value)
  alert(queryStatus.feedback)
  queryInProgress.value = false
  resetForm()
  if(queryStatus.succeed) emit('close-form')
}
 </script>