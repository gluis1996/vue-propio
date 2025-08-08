<script setup>
import { $api } from '@/utils/api'
import { ref, computed, onMounted } from 'vue'

const currentPage = ref(1)
const itemsPerPage = 10
const desserts = ref([]) // ahora es dinámico
const errors = ref(null)

const paginatedItems = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage
  return desserts.value.slice(start, start + itemsPerPage)
})

const totalPages = computed(() => Math.ceil(desserts.value.length / itemsPerPage))

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
    desserts.value = response || []
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
        <th>tipo alta</th>
        <th>tipo servicio</th>
        <th>tipo equipo</th>
        <th>pon sn 1</th>
        <th>pon sn 2</th>
        <th>codi abonado</th>
        <th>cto</th>
        <th>borne</th>
        <th>precinto</th>
        <th>latitud</th>
        <th>logintud</th>
        <th>estado</th>
        <th>comentario tecnico</th>
        <th>fecha r.</th>
        <th>tecnico</th>
        <th>operador</th>
      </tr>
    </thead>
    <tbody>
      <tr v-for="item in paginatedItems" :key="item.dessert">
        <td>{{ item.id }}</td>
        <td>{{ item.sede }}</td>
        <td>{{ item.tipo_alta }}</td>
        <td>{{ item.tipo_servicio }}</td>
        <td>{{ item.tipo_equipo }}</td>
        <td>{{ item.pon_sn_1 }}</td>
        <td>{{ item.pon_sn_2 }}</td>
        <td>{{ item.cod_abonado }}</td>
        <td>{{ item.cto }}</td>
        <td>{{ item.borne }}</td>
        <td>{{ item.num_precinto }}</td>
        <td>{{ item.latitud }}</td>
        <td>{{ item.longitud }}</td>
        <td>{{ item.estado }}</td>
        <td>{{ item.comentario_tecnico }}</td>
        <td>{{ item.fecha_registro }}</td>
        <td>{{ item.tecnico }}</td>
        <td>{{ item.operador }}</td>
      </tr>
    </tbody>
  </VTable>

  <VPagination
    v-model="currentPage"
    :length="totalPages"
    rounded="circle"
  />
</template>
