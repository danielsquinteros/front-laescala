<template>
    <v-row>
        <v-col>
            <v-data-table
            :headers="headers"
            :items="categorias"
            :search="search"
            sort-by="calories"
            class="elevation-1"
            >
            <template v-slot:top>
                <v-toolbar flat color="white">
                <v-toolbar-title>Categorías</v-toolbar-title>
                <v-divider
                    class="mx-4"
                    inset
                    vertical
                ></v-divider>
                <v-spacer></v-spacer>
                <v-text-field class="text-xs-center" v-model="search" append-icon="search" label="Buscar categorías" single-line hide-details ></v-text-field>
                <v-spacer></v-spacer>

                <v-dialog v-model="dialog" max-width="500px">
                  
                    <template v-slot:activator="{ on }">
                    <v-btn color="primary" dark class="mb-2" v-on="on">Nueva Categoría</v-btn>
                    </template>
                    <v-card>
                    <v-card-title>
                        <span class="headline">{{ formTitle }}</span>
                    </v-card-title>
        
                    <v-card-text>
                        <v-container>
                        <v-row>
                            <v-col cols="12" sm="12" md="12">
                            <v-text-field v-model="nombre" label="Nombre"></v-text-field>
                            </v-col>
                            <v-col cols="12" sm="12" md="12">
                            <v-text-field v-model="descripcion" label="Descripción"></v-text-field>
                            </v-col>
                             <v-col cols="12" sm="12" md="12" v-show="valida">
                                <div class="red--text" v-for="v in validaMensaje" :key="v" v-text="v">
                                </div>
                            </v-col>
                        </v-row>
                        </v-container>
                    </v-card-text>
        
                    <v-card-actions>
                        <v-spacer></v-spacer>
                        <v-btn color="blue darken-1" text @click="close">Cancelar</v-btn>
                        <v-btn color="blue darken-1" text @click="guardar">Guardar</v-btn>
                    </v-card-actions>
                    </v-card>
                    
                </v-dialog>
                <v-dialog v-model="adModal" max-width="290">
                    <v-card>
                        <v-card-title class="headline" v-if="adAccion==1">
                            Activar Item
                        </v-card-title>
                         <v-card-title class="headline" v-if="adAccion==2">
                            Desactivar Item
                        </v-card-title>
                        <v-card-text>
                            Estás a punto de 
                            <span v-if="adAccion==1">activar</span>
                            <span v-if="adAccion==2">desactivar</span> 
                            el item  {{ adNombre }}               
                        </v-card-text>
                        <v-card-actions>  
                            <v-spacer></v-spacer>
                            <v-btn @click="activarDesactivarCerrar()" color="green darken-1" text> 
                                Cancelar
                            </v-btn>
                            <v-btn  v-if="adAccion==1" @click="activar()" color="orange darken-4" text> 
                                Aceptar
                            </v-btn>
                            <v-btn  v-if="adAccion==2" @click="desactivar()" color="orange darken-4" text> 
                                Desactivar
                            </v-btn>                             
                        </v-card-actions>                
                    </v-card>
                </v-dialog>
                </v-toolbar>
            </template>
            <template v-slot:item.opciones="{ item }">
                <v-icon
                small
                class="mr-2"
                @click="editItem(item)"
                >
                edit
                </v-icon>
                <template v-if="item.estado">
                    <v-icon
                    small
                    @click="activarDesactivarMostrar(2,item)"
                    >
                    block
                    </v-icon>
                </template>
                 <template v-else>
                    <v-icon
                    small
                    @click="activarDesactivarMostrar(1,item)"
                    >
                    check
                    </v-icon>
                </template>
            </template>
            <template v-slot:item.estado="{ item }">
                <div v-if="item.estado === 1">
                    <span class="blue--text">Activo</span>
                </div>
                <div v-else>
                    <span class="red--text">Inactivo</span>
                </div>
            </template>
            <template v-slot:no-data>
                <v-btn color="primary" @click="listar()">Resetear</v-btn>
            </template>
            </v-data-table>
        </v-col>
    </v-row>
</template>


<script>
    import axios from 'axios'
    export default {
        data (){
            return{
                dialog: false,
                search: '',
                categorias: [],
                headers: [
                    { text: 'Opciones', value: 'opciones', sortable: false },
                    { text: 'Nombre', value: 'nombre', sortable: true },
                    { text: 'Descripción', value: 'descripcion', sortable: false },
                    { text: 'Estado', value: 'estado', sortable: false },
                ],
                desserts: [],
                editedIndex: -1,
                _id:'',
                nombre:'',
                descripcion:'',
                valida:0,
                validaMensaje:[],
                adModal:0,
                adAccion:0,
                adNombre:'',
                adId:'',
            }
        },
        computed: {
            formTitle () {
            return this.editedIndex === -1 ? 'Nueva Categoría' : 'Editar Categoría'
            },
        },

        watch: {
            dialog (val) {
            val || this.close()
            },
        },

        created () {
            this.listar()
        },

        methods: {
            validar(){
                this.valida=0;
                this.validaMensaje=[];
                if(this.nombre.length < 1 || this.nombre.length > 50){
                    this.validaMensaje.push('El nombre de la categoría debe tener entre 1-50 caracteres.')
                }
                if(this.descripcion.length > 255){
                    this.validaMensaje.push('La descripción de la categoría debe tener entre 1-255 caracteres.')
                }
                if(this.validaMensaje.length){
                    this.valida=1;
                }
                return this.valida; 

            },
            listar(){
                let me = this;
                let header = { "token": this.$store.state.token};
                let configuracion = { headers: header };
                axios.get('categoria/list', configuracion).then(function(response){
                    me.categorias = response.data;
                }).catch(function(error){
                    console.log(error);
                })
            },
            limpiar(){
                this._id='';
                this.nombre='';
                this.descripcion='';
                this.valida=0;
                this.validaMensaje=[];
                this.editedIndex=-1;
            },
            guardar(){
                let me = this;
                let header = { "token": this.$store.state.token};
                let configuracion = { headers: header };
                if(this.validar()){
                    return;
                }
                if(this.editedIndex > -1){
                    //Código para editar una categoría
                    axios.put('categoria/update', {'_id':this._id,'nombre':this.nombre,'descripcion':this.descripcion}, configuracion)
                    .then(function(response){
                        me.limpiar();
                        me.close();
                        me.listar();
                    }).catch(function(error){
                        console.log(error);
                    });


                } else {
                    //Código para guardar una categoría
                    axios.post('categoria/add', {'nombre':this.nombre,'descripcion':this.descripcion}, configuracion)
                    .then(function(response){
                        me.limpiar();
                        me.close();
                        me.listar();
                        
                    }).catch(function(error){
                        console.log(error);
                    });

                }

            },
            editItem (item) {
                this._id = item._id;
                this.nombre = item.nombre;
                this.descripcion = item.descripcion;
                this.dialog = true;
                this.editedIndex = 1;
            },

            activarDesactivarMostrar(accion,item){
                this.adModal=1;
                this.adNombre= item.nombre;
                this.adId=item._id;
                if(accion==1){
                    this.adAccion=1;
                } else if (accion==2) {
                    this.adAccion=2;
                } else {
                    this.adModal=0;
                }
            },

            activarDesactivarCerrar(){
                this.adModal=0;
            },

            activar(){
                let me = this;
                let header = { "token": this.$store.state.token};
                let configuracion = { headers: header };
                axios.put('categoria/activate', {'_id':this.adId}, configuracion)
                .then(function(response){
                    me.adModal=0,
                    me.adAccion=0,
                    me.adNombre='',
                    me.adId='',
                    me.listar();
                }).catch(function(error){
                    console.log(error);
                }); 
            },

            desactivar(){
                let me = this;
                let header = { "token": this.$store.state.token};
                let configuracion = { headers: header };
                axios.put('categoria/desactivate', {'_id':this.adId}, configuracion)
                .then(function(response){
                    me.adModal=0,
                    me.adAccion=0,
                    me.adNombre='',
                    me.adId='',
                    me.listar();
                }).catch(function(error){
                    console.log(error);
                }); 
            },


            close () {
                this.dialog = false
            },
        }
    }
</script>