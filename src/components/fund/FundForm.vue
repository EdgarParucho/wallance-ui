<template>
  <Dialog :form-is-open="formIsOpen" @close-form="$emit('close-form')">
    <form @submit.prevent="handleSubmit(fund)">
      <div class="p-4">
        <div class="h-1/3">
          <label for="fund-name" class="text-xs font-semibold">Name</label>
          <input
          id="fund-name"
          class="px-2 text-xl font-bold text-stone-50 mb-2 bg-transparent w-full border-0 border-b focus:outline-0 active:outline-0"
          v-model="fund.name"
          placeholder="College">
        </div>
        <div class="h-1/3">
          <label for="fund-description" class="text-xs font-semibold">Description</label>
          <textarea id="fund-description" class="text-sm text-stone-200 bg-transparent w-full border-0 border-b focus:outline-0 active:outline-0 focus:ring-0 active:ring-0" v-model="fund.description" placeholder="A creative description" maxlength="80"></textarea>
        </div>
        <div class="h-1/3 flex items-center justify-end my-4 space-x-2">
          <button
          class="text-white bg-transparent hover:bg-stone-700 focus:ring-2 focus:outline-none focus:ring-stone-600 rounded-md text-sm w-1/3 py-2 transition-colors"
          type="button"
          @click="$emit('close-form')"
          >
            Cancel
          </button>
          <button
          class="text-yellow-400 bg-stone-900 hover:bg-stone-700 focus:ring-2 focus:outline-none focus:ring-stone-600 font-bold rounded-md text-sm w-1/3 py-2 transition-colors disabled:text-stone-300 disabled:bg-stone-700"
          type="submit"
          >
            Save
          </button>
        </div>
      </div>
    </form>
  </Dialog>          
</template>
 
<script setup>
import { ref, inject } from 'vue'
import { useFundStore } from '../../stores/fundStore';
import Dialog from '../helper/Dialog.vue';

const props = defineProps(['form-is-open', 'editing-fund']);
const emit = defineEmits(['close-form']);
const displayAlert = inject("alert");
const fundStore = useFundStore();

const fund = ref({
  name: '',
  description: '',
});
const loading = ref(false);

const editing = props.editingFund !== null
if (editing) {
  const { name, description } = props.editingFund;
  fund.value = { name, description };
}

function handleSubmit(body) {
  if (!editing) return createFund(body);
  const { id } = props.editingFund;
  updateFund(id, body);
}

function createFund(fund) {
  loading.value = true
  fundStore.createFund(fund)
    .then((message) => {
      displayAlert({ type: "success", title: "Done", text: message });
      emit('close-form');
  })
    .catch((message) => displayAlert({ type: "error", title: "Something went wrong", text: message }))
    .finally(() => loading.value = false)
}

function updateFund(id, body) {
  loading.value = true
  fundStore.updateFund({ id, body })
    .then((message) => {
      displayAlert({ type: "success", title: "Done", text: message });
      emit('close-form');
    })
    .catch((message) => displayAlert({ type: "error", title: "Something went wrong", text: message }))
    .finally(() => loading.value = false)
}
 </script>