<template>
    <v-row class="justify-center">
        <v-col xs="12" sm="8" md="6" lg="5" xl="4">
            <v-card>
                <v-toolbar dark color="blue darken-3">
                    <v-toolbar-title>
                        Acceso al Sistema
                    </v-toolbar-title>
                </v-toolbar>
                <v-card-text>
                    <v-text-field v-model="email" autofocus color="accent" label="Email" required></v-text-field>
                    <v-text-field  v-model="password" type="password" color="accent" label="Password" required></v-text-field>
                    <v-col class="red--text" v-if="errorMensaje">
                        {{ errorMensaje }}
                    </v-col>
                </v-card-text>
                <v-card-actions class="px-3 pb-3">
                    <v-row class=" px-3 pb-3 justify-end">
                        <v-btn @click="ingresar()" color="primary">Ingresar</v-btn>
                    </v-row>
                </v-card-actions>
            </v-card>
        </v-col>
    </v-row>
</template>

<script>
import axios from 'axios'
export default {
    data(){
        return {
            email: '',
            password:'',
            errorMensaje: null
        }
    },
    methods:{
        ingresar(){
            axios.post('usuario/login',{email: this.email, password: this.password})
            .then(response => {
                return response.data;
            }).then( data => {
                this.$store.dispatch("guardarToken", data.tokenReturn);
                this.$router.push({name: 'home'});
            })
            .catch(error => {
                this.errorMensaje=null;
                if(error.response.status==404){
                    this.errorMensaje='No existe el usuario o la contraseña es incorrecta'
                } else {
                    this.errorMensaje='Ocurrio un error en el servidor';
                }
            });
        }
    }
}
</script>