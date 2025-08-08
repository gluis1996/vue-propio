<template>
    <div>

        <VRow>
            <VBtn 
                variant="tonal"
                @click = "dialogAbiertos = true"
            >
                Generar Orden
            </VBtn>
        </VRow>
        
        <dialogoregistromanula v-model="dialogAbiertos" />


        <br><br>
        <tabla_instalacion />

    </div>

</template>

<script setup>
import tabla_instalacion from "@/pages/generar_ot_instalacion/components/tabla.vue";
import dialogoregistromanula from "@/pages/generar_ot_instalacion/components/dialogRegistro.vue"

const dialogAbiertos = ref(false)
</script>