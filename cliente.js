Vue.component('cliente',{
    data:()=>{
        return {
            buscar:'',
            clientes:[],
            cliente:{
                accion : 'nuevo',
                mostrar_msg : false,
                msg : '',
                idCliente : '',
                codigo: '',
                nombre: '',
                direccion: '',
                telefono: '',
                dui: ''
            }
        }
    },
    methods:{
        buscandoCliente(){
            this.obtenerDatos(this.buscar);
        },
        eliminarCliente(cliente){
            if( confirm(`Esta seguro de eliminar el cliente ${cliente.nombre}?`) ){
               let store = abrirStore('cliente', 'readwrite'),
                   query = store.delete(cliente.idCliente);
                query.onsuccess = e=>{
                    this.nuevoCliente();
                    this.obtenerDatos();
                    this.cliente.msg = 'Cliente eliminado con exito';
                };
                query.onerror = e=>{
                    this.cliente.msg = `Error al eliminar el cliente ${e.target.error}`;
                };
            }
            this.nuevoCliente();
        },
        modificarCliente(datos){
            this.cliente = JSON.parse(JSON.stringify(datos));
            this.cliente.accion = 'modificar';
        },
        guardarCliente(){
            let store = abrirStore('cliente', 'readwrite');
            if(this.cliente.accion=="nuevo"){
                this.cliente.idCliente = generarIdUnicoFecha();
            }
            let query = store.put(this.cliente);
            query.onsuccess = e=>{
                this.nuevoCliente();
                this.obtenerDatos();
                this.cliente.msg = 'Cliente procesado con exito';
            };
            query.onerror = e=>{
                this.cliente.msg = `Error al procesar el cliente ${e.target.error}`;
            };
        },
        obtenerDatos(valor=''){
            let store = abrirStore('cliente', 'readonly'),
                data = store.getAll();
            data.onsuccess = e=>{
                this.clientes = data.result.filter(cliente=>cliente.nombre.toLowerCase().indexOf(valor.toLowerCase())>-1);
            };
            data.onerror = e=>{
                this.cliente.msg = `Error al obtener los clientes ${e.target.error}`;
            };
        },
        nuevoCliente(){
            this.cliente.accion = 'nuevo';
            this.cliente.msg = '';
            this.cliente.idCliente = '';
            this.cliente.codigo = '';
            this.cliente.nombre = '';
            this.cliente.direccion = '';
            this.cliente.telefono = '';
            this.cliente.dui = '';
        }
    },
    created(){
        //this.obtenerDatos();
    },
    template:`
        <div id="appCiente">
            <div class="card text-white" id="carCliente">
                <div class="card-header bg-primary">
                    Registro de Clientes

                    <button type="button" class="btn-close text-end" data-bs-dismiss="alert" data-bs-target="#carCliente" aria-label="Close"></button>
                </div>
                <div class="card-body text-dark">
                    <form method="post" @submit.prevent="guardarCliente" @reset="nuevoCliente">
                        <div class="row p-1">
                            <div class="col col-md-2">Codigo:</div>
                            <div class="col col-md-2">
                                <input title="Ingrese el codigo" v-model="cliente.codigo" pattern="[0-9]{3,10}" required type="text" class="form-control">
                            </div>
                        </div>
                        <div class="row p-1">
                            <div class="col col-md-2">Nombre:</div>
                            <div class="col col-md-3">
                                <input title="Ingrese el nombre" v-model="cliente.nombre" pattern="[A-Za-zñÑáéíóúü ]{3,75}" required type="text" class="form-control">
                            </div>
                        </div>
                        <div class="row p-1">
                            <div class="col col-md-2">Direccion:</div>
                            <div class="col col-md-3">
                                <input title="Ingrese la direccion" v-model="cliente.direccion" pattern="[A-Za-zñÑáéíóúü ]{3,100}" required type="text" class="form-control">
                            </div>
                        </div>
                        <div class="row p-1">
                            <div class="col col-md-2">Telefono:</div>
                            <div class="col col-md-2">
                                <input title="Ingrese el tel" v-model="cliente.telefono" pattern="[0-9]{4}-[0-9]{4}" required type="text" class="form-control">
                            </div>
                        </div>
                        <div class="row p-1">
                            <div class="col col-md-2">Zona:</div>
                            <div class="col col-md-2">
                                <input title="Ingrese su Zona" v-model="cliente.dui" required type="text" class="form-control">
                            </div>
                        </div>
                        <div class="row p-1">
                            <div class="col col-md-5 text-center">
                                <div v-if="cliente.mostrar_msg" class="alert alert-primary alert-dismissible fade show" role="alert">
                                    {{ cliente.msg }}
                                    <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
                                </div>
                            </div>
                        </div>
                        <div class="row m-2">
                            <div class="col col-md-5 text-center">
                                <input class="btn btn-success" type="submit" value="Guardar">
                                <input class="btn btn-warning" type="reset" value="Nuevo">
                            </div>
                        </div>
                    </form>
                </div>
            </div>
            <div class="card text-white" id="carBuscarCliente">
                <div class="card-header bg-primary">
                    Busqueda de Clientes

                    <button type="button" class="btn-close" data-bs-dismiss="alert" data-bs-target="#carBuscarCliente" aria-label="Close"></button>
                </div>
                <div class="card-body">
                    <table class="table table-dark table-hover">
                        <thead>
                            <tr>
                                <th colspan="6">
                                    Buscar: <input @keyup="buscandoCliente" v-model="buscar" placeholder="buscar aqui" class="form-control" type="text" >
                                </th>
                            </tr>
                            <tr>
                                <th>CODIGO</th>
                                <th>NOMBRE</th>
                                <th>DIRECCION</th>
                                <th>TEL</th>
                                <th>ZONA</th>
                                <th></th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr v-for="item in clientes" @click='modificarCliente( item )' :key="item.idCliente">
                                <td>{{item.codigo}}</td>
                                <td>{{item.nombre}}</td>
                                <td>{{item.direccion}}</td>
                                <td>{{item.telefono}}</td>
                                <td>{{item.zona}}</td>
                                <td>
                                    <button class="btn btn-danger" @click="eliminarCliente(item)">Eliminar</button>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    `
});