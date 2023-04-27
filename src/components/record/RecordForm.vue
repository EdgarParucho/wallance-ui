<template>
  <Dialog :form-is-open="formIsOpen" @close-form="$emit('close-form')">
    <div
    class="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full mx-auto sm:h-10 sm:w-10 mb-2"
    :class="editing ? 'bg-stone-700' : 'bg-stone-100 dark:bg-indigo-500'"
    >
      <PencilSquareIcon v-if="editing" class="h-6 w-6 text-stone-900 dark:text-yellow-500" aria-hidden="true" />
      <DocumentPlusIcon v-else class="h-6 w-6 text-stone-900 dark:text-white" aria-hidden="true" />
    </div>
    <h3 class="text-lg font-medium leading-6 text-stone-900 dark:text-white pl-2">
      {{ editing ? 'You are editing an exisiting record' : 'Add a new record' }}
    </h3>
    <p class="text-sm text-stone-500 dark:text-stone-300 pl-2">
      It's safe to consider records as financial movements.
    </p>
    <div aria-hidden="true">
      <div class="py-5">
        <div class="border-t border-stone-400" />
      </div>
    </div>
    <form class="p-5">
      <fieldset>
        <legend class="mx-auto text-stone-700 dark:text-stone-300 text-lg">Record Data</legend>

        <div class="my-4 flex items-center space-x-6">
          <div class="flex items-center space-x-2">
            <input
              id="credit"
              name="credit"
              type="radio"
              class="border-stone-300 text-indigo-600 focus:ring-indigo-500 p-2"
              :value="1"
              v-model="record.type"
              required
            >
            <label
              for="credit"
              class="text-md font-medium text-stone-700 dark:text-stone-300 italic font-serif"
            >
              Credit
            </label>
          </div>
          <div class="flex items-center space-x-2">
            <input
              id="debit"
              name="debit"
              type="radio"
              class="border-stone-300 text-indigo-600 focus:ring-indigo-500 p-2"
              :value="2"
              v-model="record.type"
              required
            >
            <label
              for="debit"
              class="text-md font-medium text-stone-700 dark:text-stone-300 italic font-serif"
            >
              Debit
            </label>
          </div>
        </div>
                  
        <div class="my-4 flex items-center">
          <label for="sourceID" class="w-1/2 text-md font-medium text-stone-700 dark:text-stone-300 italic font-serif">
            Source
          </label>
          <select
          id="sourceID"
          name="sourceID"
          class="w-1/2 bg-transparent border-transparent border-b-stone-300 text-stone-700 dark:text-stone-300 border-stone-300 py-2 px-3 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
          required
          v-model="record.sourceID"
          >
            <option
            class="text-white bg-stone-800 disabled:text-opacity-50"
            v-for="source in sourceList" :key="source._id"
            :disabled="(record.type !== 1 && source.savings < 1)"
            :value="source._id"
            >
            <span>{{ source.name }}</span>
            <span v-if="record.type !== 1">
              (${{ source.savings }})
            </span>
            </option>
          </select>
        </div>

        <div class="my-4 flex items-center">
          <label for="amount" class="w-1/2 text-md font-medium text-stone-700 dark:text-stone-300 italic font-serif">
            Amount
          </label>
          <div class="relative rounded-md w-1/2">
            <div class="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
              <span class="text-stone-500 dark:text-white sm:text-md">$</span>
            </div>
            <input
              type="number"
              :disabled="record.type === 2 && sourceFund === undefined"
              :min="0"
              :max="(record.type === 1) ? false : sourceFund?.savings || 0"
              name="amount"
              id="amount"
              class="w-full bg-transparent border-transparent border-b-stone-300 focus:border-indigo-500 focus:ring-indigo-500 sm:text-md text-white dark:disabled:text-stone-400 pl-6 text-right"
              placeholder="0.0"
              v-model.number="record.amount"
              required
            >
          </div>
        </div>

        <div class="my-4 flex items-center">
          <label for="date" class="w-1/2 text-md font-medium text-stone-700 dark:text-stone-300 italic font-serif">
            Date
          </label>
          <input
            type="date"
            name="date"
            id="date"
            class="w-1/2 bg-transparent border-transparent border-b-stone-300 focus:border-indigo-500 focus:ring-indigo-500 sm:text-md text-stone-900 dark:text-white"
            v-model="record.date"
            required
          >
        </div>
                
        <div class="my-4">
          <label for="note" class="w-1/2 text-md font-medium text-stone-700 dark:text-stone-300 italic font-serif">
            Note (Optional)
          </label>
          <textarea
            type="text"
            name="note"
            id="note"
            class="w-full bg-transparent border-transparent border-b-stone-300 focus:border-indigo-500 focus:ring-indigo-500 sm:text-md text-stone-900 dark:text-white"
            maxlength="40"
            placeholder="Car fuel"
            v-model="record.note"
          ></textarea>
        </div>
      </fieldset>

      <div class="bg-stone-50 dark:bg-stone-800 px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6">
        <button
        type="button"
        class="inline-flex w-full justify-center rounded-md border border-transparent bg-indigo-500 text-white 00 px-4 py-2 text-base font-medium shadow-sm hover:bg-indigo-600 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 sm:ml-3 sm:w-auto sm:text-sm"
        @click="onSave(record, editing)"
        :disabled="loading"
        >
          Save
        </button>
        <button
        type="button"
        class="mt-3 inline-flex w-full justify-center rounded-md bg-white dark:bg-stone-700 dark:text-white px-4 py-2 text-base font-medium text-stone-700 shadow-sm hover:bg-stone-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
        @click="$emit('close-form')"
        ref="cancelButtonRef"
        :disabled="loading"
        >
          Cancel
        </button>
      </div>
    </form>
  </Dialog>
</template>

<script setup>
import { ref, watch, computed, reactive } from 'vue'
import { DocumentPlusIcon, PencilSquareIcon } from '@heroicons/vue/24/outline'
import { useRecordStore } from '../../stores/recordStore';
import { useUserStore } from '../../stores/userStore';
import { useFundStore } from '../../stores/fundStore';
import Dialog from '../helper/Dialog.vue';

const props = defineProps({
  formIsOpen: {
    type: Boolean,
    required: true,
    default: false
  },
  originalRecord: {
    type: Object,
    required: false,
    default: undefined
  },
  editing: {
    type: Boolean,
    required: false,
    default: false
  }
})
const emit = defineEmits(['close-form'])
const recordStore = useRecordStore()
const userStore = useUserStore()
const fundStore = useFundStore()

const newRecord = {
  amount: 0,
  date: new Date().toISOString().slice(0, 10),
  note: '',
  sourceID: '',
  targetID: '',
  type: 2,
  user: userStore.session.user._id
}
const record = reactive(props.editing ? { ...props.originalRecord } : newRecord)
const loading = ref(false)
const sourceList = computed(() => (record.type === 1) ? userStore.session.user.creditSources : fundStore.funds)
const sourceFund = computed(() => findFundByID(record.sourceID))
const fundUpdateIsRequired = computed(() => {
  if (!props.editing) return true
  if (props.originalRecord.type !== record.type) return true
  if (props.originalRecord.amount !== record.amount) return true
  if (props.originalRecord.targetID !== record.targetID) return true
  return false
})

function findFundByID(fundID) {
  return fundStore.funds.find(fund => fund._id === fundID)
}

function onSave(record, editing) {
  const actions = defineActions(record, editing)
  const makePromises = (actions) => Array.from(actions, ({ action, arg }) => action(arg))
  const unbalancedFund = actions.find(action => action.arg.savings < 0)
  if (unbalancedFund !== undefined) return alert(
    `Cannot update, "${unbalancedFund.arg.name}" would have a negative balance.`
  )
  Promise.all(makePromises(actions))
    .then((responses) => {
      const message = responses.map(response => response.message).join('\n')
      alert(message)
      emit('close-form')
    })
    .catch((responses) => {
      const message = responses.map(response => response.message).join('\n')
      alert(message)
      loading.value = true
    })
}

function defineActions(record, editing) {
  const actions = []

  const actionOnRecord = (editing) ? recordStore.updateRecord : recordStore.createRecord
  actions.push({ action: actionOnRecord, arg: record })

  if (fundUpdateIsRequired.value) {
    const actionOnFund = fundStore.updateFund
    const relationRemains = editing ? (props.originalRecord.targetID === record.targetID) : false
    const fundToUpdate = defineFundToUpdate(record, relationRemains)
    actions.push({ action: actionOnFund, arg: fundToUpdate })
    if (editing && !relationRemains) actions.push({ action: actionOnFund, arg: defineFundToReverse(props.originalRecord) })
  }
  return actions
}

function defineFundToUpdate(record, relationRemains) {
  const originalFund = relationRemains ? defineFundToReverse(props.originalRecord) : findFundByID(record.targetID)
  const fundToUpdate = { ...originalFund }
  if (record.type === 1) fundToUpdate.savings += record.amount
  else  fundToUpdate.savings -= record.amount
  return fundToUpdate
}

function defineFundToReverse(record) {
  const originalFund = findFundByID(record.targetID)
  const fundToReverse = { ...originalFund }
  if (record.type === 1) fundToReverse.savings -= record.amount
  else fundToReverse.savings += record.amount
  return fundToReverse
}

watch(
  () => record.type,
  () => {
    record.sourceID = ''
    record.amount = 0
  }
)
watch(
  () => record.sourceID,
  (sourceID) => {
    if (record.type === 1) record.targetID = fundStore.defaultFund._id
    else if (record.sourceID !== '') record.targetID = sourceID
    else record.targetID = ''
  }
)
</script>

<style scoped>
/* Remove the default arrows from input number fields */
input::-webkit-outer-spin-button,
input::-webkit-inner-spin-button {
  -webkit-appearance: none;
  margin: 0;
}
input[type=number] {
  -moz-appearance: textfield;
}

/* Invert the default white color from input date fields icon */
::-webkit-calendar-picker-indicator {
    filter: invert(1);
}
</style>
