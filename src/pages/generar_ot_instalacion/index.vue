<template>
    <div>

        <VBtn 
            variant="tonal" 
            @click="dialogAbiertos = true">
            Generar Orden
        </VBtn>

        <dialogoregistromanula 
            v-model="dialogAbiertos" 
            @saved="onSaved" />


        <br><br>
        <tabla_instalacion :key="tableKey" />

    </div>

</template>

<script setup>
import { ref } from 'vue'
import tabla_instalacion from "@/pages/generar_ot_instalacion/components/tabla.vue";
import dialogoregistromanula from "@/pages/generar_ot_instalacion/components/dialogRegistro.vue"

const dialogAbiertos = ref(false)
const tableKey = ref(0)

const onSaved = () => {
    tableKey.value++          // 🔁 Fuerza que la tabla se remonte → GET de nuevo
    dialogAbiertos.value = false
}
</script>