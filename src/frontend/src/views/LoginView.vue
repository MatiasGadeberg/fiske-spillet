<template>
  <div class="my-2">
    <div class="min-h-screen flex items-center justify-center bg-slate-200">
      <div class="max-w-md w-full space-y-8">
        <div>
          <h2 class="mt-6 text-center text-3xl font-extrabold text-gray-900">
            {{ newTeam ? 'Opret nyt hold' : 'Log på eksisterende hold' }}
          </h2>
        </div>
        <form
          v-if="!newTeam"
          class="mt-8 space-y-6"
          @submit.prevent="auth.login(teamName, password)"
        >
          <input type="hidden" name="remember" value="true" />
          <div class="rounded-md shadow-sm -space-y-px">
            <div>
              <label for="teamName" class="sr-only">Holdnavn</label>
              <input
                v-model="teamName"
                id="teamName"
                name="teamName"
                type="text"
                required
                class="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                placeholder="Holdnavn"
              />
            </div>
            <div>
              <label for="password" class="sr-only">Kodeord</label>
              <input
                v-model="password"
                id="password"
                name="password"
                type="password"
                required
                class="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                placeholder="Kodeord"
              />
            </div>
          </div>

          <div>
            <button
              type="submit"
              class="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Log på
            </button>
          </div>
        </form>
        <div v-if="newTeam">
          <!-- Create New Team Section -->
          <form
            class="mt-8 space-y-6"
            @submit.prevent="auth.createTeam(teamName, password, repeatPassword)"
          >
            <input type="hidden" name="remember" value="true" />
            <div class="rounded-md shadow-sm -space-y-px">
              <div>
                <label for="teamName" class="sr-only">Holdnavn</label>
                <input
                  v-model="teamName"
                  id="teamName"
                  name="teamName"
                  type="text"
                  required
                  class="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                  placeholder="Holdnavn"
                />
              </div>
              <div>
                <label for="password" class="sr-only">Kodeord</label>
                <input
                  v-model="password"
                  id="password"
                  name="password"
                  type="password"
                  required
                  class="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                  placeholder="Kodeord"
                />
              </div>
              <div>
                <label for="repeat-password" class="sr-only">Gentag Kodeord</label>
                <input
                  v-model="repeatPassword"
                  id="repeat-password"
                  name="repeat-password"
                  type="password"
                  required
                  class="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                  placeholder="Gentag kodeord"
                />
              </div>
            </div>
            <div v-if="auth.loginError" class="text-red-500 text-sm mt-2">
              {{ auth.loginErrorMessage }}
            </div>

            <div>
              <button
                type="submit"
                class="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                Opret Hold
              </button>
            </div>
          </form>
        </div>
        <div v-if="!newTeam" class="flex items-center justify-between">
          <hr class="w-1/5 border-gray-300" />
          <span class="text-gray-400 text-xs">Eller</span>
          <hr class="w-1/5 border-gray-300" />
        </div>
        <div>
          <button
            @click="newTeam = !newTeam"
            class="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
          >
            {{ newTeam ? 'Annuller oprettelse' : 'Opret nyt hold' }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
function test(test: string) {
    console.log(test)
}

test('hello')
import { useAuthStore } from '@/stores/auth'
import { ref } from 'vue'

const auth = useAuthStore()
const teamName = ref('')
const repeatPassword = ref('')
const password = ref('')
const newTeam = ref(false)

</script>
