<template>
  <div>
    <a class="fixo button is-large is-danger is-loading" v-show="isLoading">Loading</a>
    <div class="container">
      <h3 class="title is-3">{{title}}</h3>
      <div class="columns">
        <div class="column is-5">
          <p class="control has-addons">
            <input class="input is-expanded" type="text" placeholder="Pesquisar produto pelo nome" v-model="search">
            <a class="button is-info" @click.prevent="searchProducts">Search</a>
          </p>
        </div>
        <div class="column is-6">
        </div>
        <div class="column is-1">
          <a class="button is-info" @click.prevent="newProduct">Novo</a>
        </div>
      </div>
      <div class="columns">
        <div class="column is-12">
          <table class="table is-narrow is-bordered">
            <thead>
              <th>ID</th>
              <th>Nome</th>
              <th>Descrição</th>
              <th>Categoria</th>
              <th>Sub Categoria</th>
              <th>Situação</th>
              <th>Ações</th>
              <!-- tr -->
            </thead>
            <tbody>
            <tr v-for="product in products">
              <td @click.prevent="viewProduct(product)" class="link">{{product.id}}</td>
              <td @click.prevent="viewProduct(product)" class="link">{{product.name}}</td>
              <td @click.prevent="viewProduct(product)" class="link">{{product.description}}</td>
              <td @click.prevent="viewProduct(product)">{{product.category}}</td>
              <td @click.prevent="viewProduct(product)">{{product.subcategory}}</td>
              <td @click.prevent="viewProduct(product)">{{product.status}}</td>
              <td class="is-icon">
               <a href="#" @click.prevent="editProduct(product)">
                  <i class="fa fa-edit"></i>
                </a>
                <a href="#" @click.prevent="removeProduct(product)">
                  <i class="fa fa-trash"></i>
                </a>
              </td>
            </tr>
            </tbody>
          </table>
          <Pagination :total="total" :page="page" :itens-per-page="itensPerPage" @change-page="onChangePage"></Pagination>
        </div>
      </div>
    </div>

    <div id="modal_product" class="modal" :class="{'is-active':showModal}">
      <div class="modal-background"></div>
      <div class="modal-card">
        <header class="modal-card-head">
          <p class="modal-card-title">Produto: {{selected.name}}</p>
          <button class="delete" @click.prevent="showModal=false"></button>
        </header>

        <section class="modal-card-body">
          <div class="columns">
            <div class="column">
              <label class="label">Nome</label>
              <p class="control">
                <input class="input" type="text" placeholder="Nome" :readonly="readOnly" v-model="selected.name">
              </p>
            </div>
            <div class="column" v-show="!isNew">
              <label class="label">ID</label>
              <p class="control">
                <input class="input" type="text" placeholder="ID" :readonly="readOnly" v-model="selected.id">
              </p>
            </div>
          </div>
          <label class="label">Descrição</label>
          <p class="control">
            <textarea class="textarea" placeholder="Descrição" v-model="selected.description"></textarea>
          </p>
          <p class="control">
            <label class="label">Valor unitário</label>
            <input class="input" type="text" placeholder="Valor unitário" v-model="selected.unitValue" v-mask="'#.##0,00'" />
          </p>
          <label class="label">Situação</label>
          <p class="control">
            <input class="input" type="text" placeholder="Text input" v-model="selected.status">
          </p>
        </section>

        <footer class="modal-card-foot">
          <a class="button is-primary" @click.prevent="saveProduct">Salvar</a>
          <a class="button" @click.prevent="showModal=false">Cancelar</a>
        </footer>
      </div>
    </div>
  </div>
</template>

<script>
  /* eslint-disable no-undef */
  import Vue from 'vue'
  import Pagination from './Pagination.vue'
  import VLink from './VLink.vue'

  // jquery mask
  // http://igorescobar.github.io/jQuery-Mask-Plugin/

  // jquery-masked-input
  // https://github.com/digitalBush/jquery.maskedinput

  // datepicker
  // https://laracasts.com/discuss/channels/vue/vuejs-get-v-model-value-in-custom-directive
  // https://forum.vuejs.org/t/making-jquery-ui-datepicker-works-with-vuejs/2752/7

  export default {
    data () {
      return {
        title: '[Products.vue] Listing all registered products',
        search: '',
        products: [],
        page: 1,
        total: 0,
        selected: {},
        itensPerPage: 10,
        showModal: false,
        readOnly: false,
        isLoading: false,
        isNew: false
      }
    },
    directives: {
      mask: {
        // https://gist.github.com/logaretm/13f9f0fa1df5b1ecf1e5#file-directives-js
        // bind, inserted, update, unbind
        update: function (el,maskval) {
          $(el).mask(maskval.value, {reverse:true});
        }
      }
    },
    components: {
      Pagination, VLink
    },
    mounted() {
      // hardcoded mask set with jquery
      //$('#unitValue').mask('#.##0,00', {reverse:true});
    },
    methods: {
      onChangePage(page) {
        this.page = page
        this.loadProducts()
      },
      showLoading() {
        this.isLoading = true
      },
      hideLoading() {
        this.isLoading = false
      },
      loadProducts() {
        let t = this
        this.showLoading()
        this.isNew = false

        let start = (this.page * this.itensPerPage) - (this.itensPerPage)
        let end = this.page * this.itensPerPage
        let qString = ''

        if (this.search) {
          qString = `&q=${this.search}`
        }

        this.$http.get(`/products?_start=${start}&_end=${end}${qString}`).then(
          response => {
            // t.products = response.body -> works
            // t.products = response.json()
            t.products = response.body
            t.total = response.headers['X-Total-Count']
          },
          error => {
            console.log(error)
          }).finally(function () {
            t.hideLoading()
          })
      },
      searchProducts() {
        this.loadProducts()
      },
      newProduct() {
        this.selected = {}
        this.showModal = true
        this.readOnly = false
        this.isNew = true
      },
      viewProduct(product) {
        this.selected = product
        this.showModal = true
        this.readOnly = true
        this.isNew = false
      },
      editProduct(product) {
        this.selected = product
        this.showModal = true
        this.readOnly = false
        this.isNew = false
      },
      removeProduct(product) {
        let self = this
        swal({
          title: 'Você tem certeza?',
          text: `Deseja remover o produto: "${product.name}"?`,
          type: 'warning',
          showCancelButton: true,
          confirmButtonColor: '#DD6B55',
          cancelButtonText: 'Cancelar',
          confirmButtonText: 'Sim',
          showLoaderOnConfirm: true,
          closeOnConfirm: false }, function() {
          self.$http.delete(`/products/${product.id}`).then(
            result => {
              swal('Produto removido com sucesso!')
              self.loadProducts()
            })
        })
      },
      saveProduct() {
        if (this.selected.id != null) { // EDIT A PRODUCT
          this.$http.put(`/products/${this.selected.id}`, this.selected).then(
            response => {
              this.$set('selected', {})
              this.$set('showModal', false)
            },
            error => {
              console.error(error)
            }
          ).finally(function () {
            this.loadProducts()
          })
        } else { // NEW PRODUCT
          this.$http.post(`/products`, this.selected).then(
            response => {
              this.$set('selected', {})
              this.$set('showModal', false)
            },
            error => {
              console.error(error)
            }
          ).finally(function () {
            this.loadProducts()
          })
        }
      }
    },
    created() {
      this.loadProducts()
    }
  }
</script>
