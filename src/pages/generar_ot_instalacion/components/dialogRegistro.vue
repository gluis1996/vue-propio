<template>
    <VDialog
            :model-value="props.modelValue"
            max-width="900"
            @update:model-value="dialogVisibleUpdate"
        >
        <VCard class="create-app-dialog pa-sm-11 pa-3">
            <!-- 👉 dialog close btn -->
            <DialogCloseBtn
                variant="text"
                size="default"
                @click="emit('update:modelValue', false)"
            />

            <VCardText class="pt-5">
                <div class="text-center mb-6">
                    <h4 class="text-h4 text-center mb-2">
                        Create App
                    </h4>
                    <div class="text-body-1">
                        Provide data with this form to create your app.
                    </div>
                </div>

                <VRow>
                    <VCol>
                        <v-select 
                            
                            density="compact"
                            :items="['Instalacion Duo', 'Instalacion Cable', 'Instalacion Internet', 'Migracion Tecnologia', 'Cambio de Equipo']"
                            label="T. Orden" required>
                        </v-select>
                    </VCol>
                    <VCol>
                        <v-select density="compact"
                                :items="['cable peru', 'chosica', 'puente piedra', 'comas', 'ñaña']" label="Filial"
                                required></v-select>
                    </VCol>
                    <VCol>
                        <v-select  density="compact"
                                :items="['VSOL-INTERNET', 'VSOL-CATV', 'CABLEPERU']" label="Onu Type"
                                required></v-select>
                    </VCol>
                    <VCol>
                        <v-text-field  density="compact" hint="123456"
                                label="Abonado"></v-text-field>
                    </VCol>
                </VRow>
            </VCardText>
        </VCard>
    </VDialog>
</template>

<script setup>
import { defineProps, defineEmits } from 'vue'

// Acepta el v-model estándar
const props = defineProps({
  modelValue: { type: Boolean, default: false },
})

const emit = defineEmits(['update:modelValue'])

// Sincroniza cambios del VDialog hacia el padre
const dialogVisibleUpdate = (val) => {
  emit('update:modelValue', val)
}
</script>

<style lang="scss">
.stepper-content .card-list {
    --v-card-list-gap: 1rem;
}
</style>
