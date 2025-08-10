<template>
    <VDialog :model-value="props.modelValue" max-width="900" @update:model-value="dialogVisibleUpdate">
        <VCard class="create-app-dialog pa-sm-11 pa-3">
            <!-- 👉 dialog close btn -->
            <DialogCloseBtn variant="text" size="default" @click="emit('update:modelValue', false)" />

            <VCardText class="pt-5">
                <div class="text-center mb-6">
                    <h4 class="text-h4 text-center mb-2">
                        Registra Instalacion
                    </h4>
                </div>

                <VRow>
                    <VCol>
                        <VSelect 
                            v-model="sede" 
                            density="compact" 
                            :items="['cable peru', 'chosica', 'puente piedra', 'comas', 'ñaña']" 
                            label="Sede" required>
                        </VSelect>
                    </VCol>
                    <VCol>
                        <VSelect 
                            density="compact"
                            :items="['alta nueva', 'migracion de EoC -> Fibra', 'migracion de plan', 'Cambio de Equipo']"
                            label="T. Alta" required>
                        </VSelect>
                    </VCol>
                    <VCol>
                        <VSelect 
                            density="compact" 
                            :items="['Duo', 'Cable', 'Internet']" 
                            label="T. Servicio" required>
                        </VSelect>
                    </VCol>
                    <VCol>
                        <VSelect 
                            density="compact" 
                            :items="['Huawei', 'Simple']" 
                            label="T. Equipo" required>
                        </VSelect>
                    </VCol>
                </VRow>
                <VRow>
                    <VCol>
                        <VTextField v-model="abonado" label="Abonado" density="compact"></VTextField>
                    </VCol>
                    <VCol>
                        <VTextField label="Cod. Ppoe" density="compact" hint="1234@12345678"></VTextField>
                    </VCol>
                    <VCol>
                        <VTextField v-model="sn1" label="Pon Sn 1" density="compact" @keyup.enter="consultar_pon_sn()"></VTextField>
                    </VCol>
                    <VCol>
                        <VTextField label="Pon Sn 2" density="compact"></VTextField>
                    </VCol>
                </VRow>
                <VRow>
                    <VCol>
                        <VTextField label="Caja" density="compact"></VTextField>
                    </VCol>
                    <VCol>
                        <VTextField type="number" label="Borne" density="compact"></VTextField type="number">
                    </VCol>
                    <VCol>
                        <VTextField label="Precinto" density="compact"></VTextField>
                    </VCol>
                    <VCol>
                        <VSelect density="compact" :items="['50M', '100M', '200M', '300M', '400M', '500M', '600M', '700M', '800M', '900M', '1G', 'CATV']" label="Speed" required>
                        </VSelect>
                    </VCol>
                    <VCol>
                        <VTextField label="Coordenadas" density="compact"></VTextField>
                    </VCol>
                </VRow>
                <VRow>
                    <VCol align="center">
                        <VBtn variant="tonal" color="success" @click="username()">Authorisar</VBtn>
                    </VCol>
                    <VCol align="center">
                        <VBtn color="error" variant="tonal">Cancelar</VBtn>
                    </VCol>
                </VRow>
            </VCardText>
        </VCard>
    </VDialog>

    <v-overlay v-model="cargandoPantalla" class="d-flex align-center justify-center" persistent>
        <v-progress-circular indeterminate size="64" color="primary" />
    </v-overlay>
</template>

<script setup>
import { defineProps, defineEmits, ref } from 'vue'
import { VBtn, VRow } from 'vuetify/components'
import { getAuth } from 'firebase/auth'
import { $api } from '@/utils/api'
const user = getAuth().currentUser
const operador = ref(user?.email || 'Usuario desconocido')
const cargandoPantalla = ref(false)
//definimos variables para capturar los input del formulario
const sede = ref();
const tipoAlta = ref('');
const tipoServicio = ref('');
const tipoEquipo = ref('');
const abonado = ref('');
const ppoe = ref('');
const sn1 = ref('');
const sn2 = ref('');
const caja = ref('');
const borne = ref('');
const precinto = ref('');
const coordenadas = ref('');
const pon = ref('');
const oltid = ref('');
const zona = ref('');
const speed = ref('');

const consultar_pon_sn = async () => {
    if (!sn1.value || !abonado.value || !sede.value) {
        alert('Validar campos requeridos para la consulta')

    }
     cargandoPantalla.value = true;  // 🔄 Activa loading
    try {
        const response = await $api('instalacion/buscar-sn', {
            method: "POST",
            body: {
                "pon_sn_1": sn1.value,
                "sede": sede.value,
                "cod_abonado": abonado.value
            },
            onResponseError({ response }) {
                errors.value = response._data.errors
            },
        });

        console.log(response);
        

    } catch (error) {
        console.error('❌ Error al consultar:', error.message);
    } finally {
        cargandoPantalla.value = false;  // ✅ Desactiva loading
    }
};

const username = async () => {
    console.log(operador);
}























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
