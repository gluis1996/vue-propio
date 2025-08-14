<script setup>
import { $api } from '@/utils/api'
import { ref, computed, onMounted } from 'vue'

const currentPage = ref(1)
const itemsPerPage = 10
const desserts = ref([]) // ahora es dinámico
const errors = ref(null)
const loadings = ref({})

const load = (id) => {
  loadings.value[id] = true
  setTimeout(() => {
    loadings.value[id] = false
  }, 3000)
  console.log(id);
  
}

const paginatedItems = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage
  return desserts.value.slice(start, start + itemsPerPage)
})

const totalPages = computed(() => Math.ceil(desserts.value.length / itemsPerPage))

const formatFecha = (fechaISO) => {
  if (!fechaISO) return ''
  return new Date(fechaISO).toLocaleString('es-PE', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit'
  })
}

const consuta_trabajos = async () => {
  try {
    const response = await $api('instalacion', {
      method: 'GET',
      onRequestError({ response }) {
        errors.value = response._data.errors
      }
    })
    console.log('Datos obtenidos:', response)

    // Asigna la data al array para mostrarla
    let data = Array.isArray(response) ? response : (response?.data || [])
    desserts.value = data.sort((a, b) => new Date(b.fecha_registro) - new Date(a.fecha_registro))
  } catch (err) {
    console.error(err)
  }
}

// Llamar automáticamente al montar el componente
onMounted(() => {
  consuta_trabajos()
})

</script>

<template>
  <VTable>
    <thead>
      <tr>
        <th>id</th>
        <th>sede</th>
        <th>alta</th>
        <th>servicio</th>
        <th>equipo</th>
        <th>sn1</th>
        <th>abona.</th>
        <th>cto</th>
        <th>B</th>
        <th>precinto</th>
        <th>latitud</th>
        <th>logintud</th>
        <th>estado</th>
        <th>fecha r.</th>
        <th>operador</th>
        <th>acciones</th>
      </tr>
    </thead>
    <tbody>
      <tr v-for="item in paginatedItems" :key="item.id">
        <td>{{ item.id }}</td>
        <td>{{ item.sede }}</td>
        <td>{{ item.tipo_alta }}</td>
        <td>{{ item.tipo_servicio }}</td>
        <td>{{ item.tipo_equipo }}</td>
        <td>{{ item.pon_sn_1 }}</td>
        <td>{{ item.cod_abonado }}</td>
        <td>{{ item.cto }}</td>
        <td>{{ item.borne }}</td>
        <td>{{ item.num_precinto }}</td>
        <td>{{ item.latitud }}</td>
        <td>{{ item.longitud }}</td>
        <td>{{ item.estado }}</td>
        <td>{{ formatFecha(item.fecha_registro) }}</td>
        <td>{{ item.operador }}</td>
        <td>
          <VBtn 
            :loading="loadings[item.id]"
            :disabled="loadings[item.id]"
            color="info" @click="load(item.id)"
            >
            OzMap
            <template #loader>
              <span class="custom-loader">
                <VIcon icon="ri-refresh-line" />
              </span>
            </template>
          </VBtn>
        </td>
      </tr>
    </tbody>
  </VTable>

  <VPagination v-model="currentPage" :length="totalPages" rounded="circle" />
</template>

<style scoped>
.custom-loader {
  display: flex;
  animation: loader 1s infinite;
}

@keyframes loader {
  from {
    transform: rotate(0);
  }

  to {
    transform: rotate(360deg);
  }
}
</style>