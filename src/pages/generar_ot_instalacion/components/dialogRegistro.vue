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
                        <VSelect v-model="sede" density="compact"
                            :items="['cable peru', 'chosica', 'puente piedra', 'comas', 'ñaña']" label="Sede" required>
                        </VSelect>
                    </VCol>
                    <VCol>
                        <VSelect v-model="tipoAlta" density="compact"
                            :items="['alta nueva', 'migracion de EoC -> Fibra', 'migracion de plan', 'Cambio de Equipo']"
                            label="T. Alta" required>
                        </VSelect>
                    </VCol>
                    <VCol>
                        <VSelect v-model="tipoServicio" density="compact" :items="['Duo', 'Cable', 'Internet']"
                            label="T. Servicio" required>
                        </VSelect>
                    </VCol>
                    <VCol>
                        <VSelect v-model="tipoEquipo" density="compact" :items="['Huawei', 'Simple']" label="T. Equipo"
                            required>
                        </VSelect>
                    </VCol>
                </VRow>
                <VRow>
                    <VCol>
                        <VTextField v-model="abonado" label="Abonado" density="compact"></VTextField>
                    </VCol>
                    <VCol>
                        <VTextField v-model="ppoe" label="Cod. Ppoe" density="compact" hint="1234@12345678"></VTextField>
                    </VCol>
                    <VCol>
                        <VSelect v-model="vlanSeleccionada" density="compact"
                            :items="vlandisponibles"
                            label="vlan" required>
                        </VSelect>
                    </VCol>
                    <VCol>
                        <VTextField v-model="sn1" label="Pon Sn 1" density="compact" @keyup.enter="consultar_pon_sn()">
                        </VTextField>
                    </VCol>
                    <VCol v-if="mostrarSn2">
                        <VTextField v-model="sn2" label="Pon Sn 2" density="compact"></VTextField>
                    </VCol>
                </VRow>
                <VRow>
                    <VCol>
                        <VTextField v-model="caja" label="Caja" density="compact"></VTextField>
                    </VCol>
                    <VCol>
                        <VTextField v-model="borne" type="number" label="Borne" density="compact"></VTextField type="number">
                    </VCol>
                    <VCol>
                        <VTextField v-model="precinto" label="Precinto" density="compact"></VTextField>
                    </VCol>
                    <VCol>
                        <VSelect v-model="speed" density="compact"
                            :items="['50M', '100M', '200M', '300M', '400M', '500M', '600M', '700M', '800M', '900M', '1G', 'CATV']"
                            label="Speed" required>
                        </VSelect>
                    </VCol>
                    <VCol>
                        <VTextField v-model="coordenadas" label="Coordenadas" density="compact"></VTextField>
                    </VCol>
                </VRow>

                <VRow justify="center" v-if="mostrarChips">
                    <v-chip 
                        class="ma-2" 
                        color="primary" 
                        label>
                        <v-icon icon="ri-router-line" start></v-icon>
                        OLT ID : {{ olt_id }}
                    </v-chip>

                    <v-chip 
                        class="ma-2" 
                        color="warning" label>
                        <v-icon icon="ri-ram-line" start></v-icon>
                        TARJETA : {{ tarjeta }}
                    </v-chip>

                    <v-chip 
                        class="ma-2" 
                        color="success" label>
                        <v-icon icon="ri-computer-line" start></v-icon>
                        PON : {{ pon }}
                    </v-chip>

                    <v-chip 
                        class="ma-2" 
                        color="error" label
                        style="max-width: 210px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;"
                        :title="`ZONA : ${zona}`">
                        <v-icon icon="ri-map-pin-line" start></v-icon>
                        ZONA : {{ zona }}
                    </v-chip>
                </VRow>
                <VRow>
                    <VCol align="center">
                        <VBtn variant="tonal" color="success" @click="registrarOnu()">Authorisar</VBtn>
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
import { defineProps, defineEmits, ref, computed, watch } from 'vue'
import { VBtn, VRow } from 'vuetify/components'
import { getAuth } from 'firebase/auth'
import { $api } from '@/utils/api'

const user = getAuth().currentUser
const operador = ref(user?.email || 'Usuario desconocido')
const cargandoPantalla = ref(false)
const mostrarChips = ref(false)
//definimos variables para capturar los input del formulario
const sede = ref();
const tipoAlta = ref();
const tipoServicio = ref();
const tipoEquipo = ref();
const abonado = ref('');
const ppoe = ref('');
const sn1 = ref('');
const sn2 = ref('');
const caja = ref('');
const borne = ref('');
const precinto = ref('');
const coordenadas = ref('');
const pon = ref();
const olt_id = ref();
const tarjeta = ref();
const zona = ref();
const speed = ref();
const vlandisponibles = ref([]);
const vlanSeleccionada = ref();
const pon_type = ref();
let consultaont = false

const mostrarSn2 = computed(() => {
    let visible = false;

    if (!tipoServicio.value) {
        visible = false;
    } else {
        if (tipoServicio.value === 'Cable') {
            visible = false;
        } else if (tipoServicio.value === 'Internet' && tipoEquipo === 'Simple') {
            visible = false;
        } else if (tipoServicio.value === 'Internet' && tipoEquipo.value === 'Huawei') {
            visible = true;
        }   else if (tipoServicio.value === 'Duo' && tipoEquipo.value === 'Simple') {
            visible = false;
        }   else if (tipoServicio.value === 'Duo' && tipoEquipo.value === 'Huawei') {
            visible = true;
        }
    }

    return visible;
})

watch(mostrarSn2, visible => { if (!visible) sn2.value = '' })

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

        const data = response;
        vlandisponibles.value = data.dataauthorisacion.vlan || [];
        vlanSeleccionada.value = '';
        ppoe.value = data.cuenta_ppoe.user_ppoe;
        const onuEncontrada = data.dataauthorisacion.onu_encontrada || {};
        
        console.log(onuEncontrada);

        if (Object.keys(onuEncontrada).length>0) {
            consultaont = 1;
            olt_id.value = onuEncontrada.olt_id || '—';
            tarjeta.value = onuEncontrada.board || '—';
            pon.value = onuEncontrada.port || '—';
            zona.value = onuEncontrada.pon_description || '—';       
            sn1.value = onuEncontrada.sn;
            mostrarChips.value = true;
        } else {
            mostrarChips.value = false
        }

    } catch (error) {
        console.error('❌ Error al consultar:', error.message);
    } finally {
        cargandoPantalla.value = false;  // ✅ Desactiva loading
    }
};

const registrarOnu = async () => {
    
    let onutype = '';
    let on_mode = '';

    

    if (!tipoEquipo.value === 'Huawei') {
        on_mode = 'Bridging';
        if (!speed.value === 'CATV') {
            onutype = 'VSOL-INTERNET'
        } else {
            onutype = 'VSOL-CATV'
        }
    } else {
        on_mode = 'Routing';
        onutype = 'CABLEPERU';
    }
    cargandoPantalla.value = true;
    console.log('✅ Formulario válido, procesando envío...')

    // Aquí procesas los datos capturados
    const [lat, lng] = coordenadas.value.split(',').map(c => c.trim())

    const payloadSmartOlt = {
        olt_id: olt_id.value,
        pon_type: 'gpon',
        board: tarjeta.value,
        port: pon.value,
        sn: sn1.value,
        onu_type: onutype,
        onu_mode: on_mode,
        vlan: vlanSeleccionada.value,
        name: ppoe.value,
        address_or_comment: `caja ${caja.value} borne ${borne.value} precinto ${precinto.value}`,
        onu_external_id: sn1.value,
        upload_speed_profile_name: speed.value,
        download_speed_profile_name: speed.value,
        zone: zona.value,
        latitude: lat || '',
        longitude: lng || '',
        disable_catv: 'True' // 👉 si lo vas a manejar por defecto
    };

    if (consultaont) {
        console.log('se usara smarto olt');
        console.log(payloadSmartOlt);
        cargandoPantalla.value = false;
    }else{
        console.log('solo se registrara en la base de datos');
        cargandoPantalla.value = false;
    }

    // const payloadBaseDatos = {
    //     sede: filial.value,
    //     tipo_alta: orden.value,
    //     tipo_servicio: orden.value,
    //     tipo_equipo: onutype.value,
    //     pon_sn_1: ponSn.value,
    //     pon_sn_2: ponSn2.value || '',
    //     cod_abonado: abonado.value,
    //     cto: caja.value,
    //     borne: borne.value,
    //     num_precinto: precinto.value,
    //     latitud: lat || '',
    //     longitud: lng || '',
    //     estado: "realizado",
    //     comentario_tecnico: "",
    //     operador: operador.value
    // }

    // try {
    //     const response = await axios.post(`${URL}/api/instalacion/autorizar-onu`, payload);
    //     const d = response.data;
    //     console.log(d);

    //     if (d.data.response_code === "success") {
    //         const respon = await axios.post(`${URL}/api/instalacion/`, payload2);
    //         console.log('✅ ONU registrada:', response.data);
    //         resetearFormulario(); // ✅ limpia todo
    //         mostrar.value = false; // ✅ cierra el diálogo si lo deseas
    //         cargandoPantalla.value = false;
    //         Swal.fire({
    //             icon: 'success',
    //             title: '✅ ONU registrada con éxito',
    //             text: `El registro se ha completado correctamente.`,
    //             timer: 2500,
    //             timerProgressBar: true,
    //             showConfirmButton: false
    //         })
    //     }
    //     // aquí podrías mostrar mensaje de éxito, cerrar modal, etc.
    // } catch (error) {
    //     console.error('❌ Error al registrar ONU:', error.response?.data || error.message);
    // }
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
