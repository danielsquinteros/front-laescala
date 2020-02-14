<template>
  <v-app id="app">
    <v-navigation-drawer
      v-model="drawer"
      :clipped="$vuetify.breakpoint.lgAndUp"
      app
      v-if="logueado"
    >
      <v-list dense style="padding: 0px">
        <template v-if="esAdministrador || esDentista || esAsistente">
          <v-list-item :to="{name: 'home'}">
            <v-list-item-action>
              <v-icon>home</v-icon>
            </v-list-item-action>
            <v-list-item-title>
              Inicio
            </v-list-item-title>
          </v-list-item>
        </template>
        <template v-if="esAdministrador || esDentista || esAsistente">
          <v-list-group>

            <v-list-item slot="activator">
              <v-list-item-content>
                <v-list-item-title>
                  Inventario
                </v-list-item-title>
              </v-list-item-content>
            </v-list-item>

            <v-list-item :to="{name: 'categoria'}">
              <v-list-item-action>
                <v-icon>table_chart</v-icon>
              </v-list-item-action>
              <v-list-item-content>
                <v-list-item-title>
                  Categorías
                </v-list-item-title>
              </v-list-item-content>
            </v-list-item>

            <v-list-item :to="{name: 'articulo'}">
              <v-list-item-action>
                <v-icon>table_chart</v-icon>
              </v-list-item-action>
              <v-list-item-content>
                <v-list-item-title>
                  Artículos
                </v-list-item-title>
              </v-list-item-content>
            </v-list-item>
          </v-list-group>
        </template>
        <template v-if="esAdministrador">
          <v-list-group>
            <v-list-item slot="activator">
              <v-list-item-content>
                <v-list-item-title>
                  Accesos
                </v-list-item-title>
              </v-list-item-content>
            </v-list-item>
            <v-list-item :to="{name: 'usuario'}">
              <v-list-item-action>
                <v-icon>table_chart</v-icon>
              </v-list-item-action>
              <v-list-item-content>
                <v-list-item-title>
                  Usuarios
                </v-list-item-title>
              </v-list-item-content>
            </v-list-item>
          </v-list-group>
        </template> 
      </v-list>
    </v-navigation-drawer>

    <v-app-bar
      :clipped-left="$vuetify.breakpoint.lgAndUp"
      app
      color="blue darken-3"
      dark
    >
      <v-toolbar-title
        style="width: 300px"
        class="ml-0 pl-3"
      >
        <v-app-bar-nav-icon @click.stop="drawer = !drawer"></v-app-bar-nav-icon>
        <span class="hidden-sm-and-down">Proyecto La Escala</span>
      </v-toolbar-title>      
      <v-spacer></v-spacer>
      <v-btn class="mr-3"  @click="salir()"  icon v-if="logueado">
        <v-icon>logout</v-icon>  Salir
      </v-btn>
      <v-btn  class="mr-3" :to="{name: 'login'}" icon v-else  >
        <v-icon  >apps</v-icon>
      </v-btn>
    </v-app-bar>
    <v-content>
      <v-container
        fluid
        fill-height
        align-start
      >
        <v-slide-y-transition mode="out-in">
          <router-view/>
        </v-slide-y-transition>
      </v-container>
    </v-content>
  </v-app>
</template>

<script>

export default {
  name: 'App',
  data () {
    return {
      drawer: true
    }
  },
  computed:{
    logueado(){
      return this.$store.state.usuario;
    },
    esAdministrador(){
      return this.$store.state.usuario && this.$store.state.usuario.rol == 'Administrador';
    },
    esDentista(){
      return this.$store.state.usuario && this.$store.state.usuario.rol == 'Dentista';
    },
    esAsistente(){
      return this.$store.state.usuario && this.$store.state.usuario.rol == 'Asistente';
    }
  },
  created(){
    this.$store.dispatch("autoLogin");
  },
  methods:{
    salir(){
      this.$store.dispatch("salir");
    }
  }
};
</script>
