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
          <p class="modal-card-title" v-if="!isNew">Detalhes do produto: {{selected.name}}</p>
          <p class="modal-card-title" v-else>Cadastrar novo produto</p>
          <button class="delete" @click.prevent="showModal=false, clearValidation()"></button>
        </header>

        <section class="modal-card-body">

          <div class="columns">
            <div class="column" v-show="!isNew">
              <label class="label">ID</label>
              <p class="control">
                <input class="input" type="text" placeholder="ID" :readonly="readOnly" v-model="selected.id">
              </p>
            </div>
            <div class="column is-three-quarters">
              <label class="label">Nome</label>
              <p class="control">
                <input class="input" type="text" placeholder="Nome" name="name" :readonly="readOnly" v-model="selected.name" v-validate data-vv-rules="required" :class="{'is-danger': errors.has('name')}">
                <span class="help is-danger" v-if="errors.has('name')">{{ errors.first('name') }}</span>
              </p>
            </div>
          </div>

          <div class="columns">
            <div class="column">
              <label class="label">Descrição</label>
              <p class="control">
                <textarea class="textarea" placeholder="Descrição" name="description" v-model="selected.description" v-validate data-vv-rules="required" :class="{'is-danger': errors.has('description')}"></textarea>
                <span class="help is-danger" v-if="errors.has('description')">{{ errors.first('description') }}</span>
              </p>
            </div>
          </div>

          <div class="columns">
            <div class="column">
              <p class="control">
                <label class="label">Valor unitário</label>
                <input class="input" type="text" placeholder="Valor unitário" name="unitValue" v-model="selected.unitValue" v-maskrev="'#.##0,00'" v-validate data-vv-rules="required" :class="{'is-danger': errors.has('unitValue')}" />
                <span class="help is-danger" v-if="errors.has('unitValue')">{{ errors.first('unitValue') }}</span>
              </p>
            </div>
            <div class="column">
              <p class="control">
                <label class="label">Número serial</label>
                <input class="input" type="text" placeholder="Número serial" name="serialNumber" v-model="selected.serialNumber" v-mask="'SSS-000-000'" v-validate data-vv-rules="required" :class="{'is-danger': errors.has('serialNumber')}" />
                <span class="help is-danger" v-if="errors.has('serialNumber')">{{ errors.first('serialNumber') }}</span>
              </p>
            </div>
            <div class="column">
              <p class="control">
                <label class="label">Data de aquisição</label>
                  <input class="input" type="text" placeholder="Data de aquisição" v-model="selected.acquisitionDate" v-if="!isNew" />
                  <datepicker class="input" name="acquisitionDate" v-model="selected.acquisitionDate" :options="fpOptions" placeholder="Data de aquisição" v-validate data-vv-rules="required" :class="{'is-danger': errors.has('acquisitionDate')}" v-else />
                  <span class="help is-danger" v-if="errors.has('acquisitionDate')">{{ errors.first('acquisitionDate') }}</span>
              </p>
            </div>
          </div>

          <div class="columns">
            <div class="column">
              <p class="control">
                <label class="label">Categoria</label>
                <span class="select">
                  <select v-model="selected.category" v-on:change="replaceSubcategories" v-validate data-vv-rules="required" :class="{'is-danger': errors.has('category')}">
                    <option v-for="item in categories" v-bind:value="item.value"> {{item.label}} </option>
                  </select>
                  <span class="help is-danger" v-if="errors.has('category')">{{ errors.first('category') }}</span>
                </span>
              </p>
            </div>
            <div class="column">
              <p class="control">
                <label class="label">Sub-categoria</label>
                <span class="select">
                  <select v-model="selected.subcategory">
                      <option v-for="item in subcategories" v-bind:value="item.value"> {{ item.label }} </option>
                  </select>
                </span>
              </p>
            </div>
          </div>

          <div class="columns">
            <div class="column is-half">
              <p class="control">
                <label class="label">Situação</label>
                <label class="radio">
                  <input type="radio" value="D" v-model="status">
                  <label for="disponivel">Disponível</label>
                </label>
                <label class="radio">
                  <input type="radio" id="utilizado" value="U" v-model="status">
                  <label for="utilizado">Em utilização</label>
                </label>
              </p>
            </div>
          </div>

          <div class="columns">
            <div class="column is-half">
              <p class="control">
                <label class="label">E-mail do fornecedor</label>
                <input name="email" v-validate data-vv-rules="required|email" class="input" :class="{'is-danger': errors.has('email')}" type="text" placeholder="E-mail do fornecedor" v-model="selected.vendorMail" />
                <span class="help is-danger" v-if="errors.has('email')">{{ errors.first('email') }}</span>
              </p>
            </div>
            <div class="column"> <!-- TODO - hide the component when not used for create/update -->
              <label class="label">Telefone comercial do fornecedor</label>
              <p class="control">
                <input type="tel" class="input" v-model="selected.vendorPhone" v-intlphone>
                <span class="help is-danger is-hidden" id="invalid-phone">Telefone comercial inválido</span>
                <span class="help is-success is-hidden" id="valid-phone">Telefone comercial válido</span>
              </p>
            </div>
          </div>
        </section>

        <footer class="modal-card-foot">
          <a class="button is-primary" @click.prevent="saveProduct">Salvar</a>
          <a class="button" @click.prevent="showModal=false, clearValidation()">Cancelar</a>
        </footer>
      </div>
    </div>
  </div>
</template>

<script>
  // jquery mask
  // http://igorescobar.github.io/jQuery-Mask-Plugin/

  // datepicker (use fpOptions for configuration)
  // https://jrainlau.github.io/vue-flatpickr/
  // https://chmln.github.io/flatpickr/

  // vue-select (not ready for vue 2.0 yet)
  // https://sagalbot.github.io/vue-select/
  // https://github.com/sagalbot/vue-select/issues/94
  // http://element.eleme.io
  // https://jsfiddle.net/aj6g87dh/1/

  // form validation
  // https://dotdev.co/form-validation-using-vue-js-2-35abd6b18c5d
  // https://github.com/logaretm/vee-validate
  // http://vee-validate.logaretm.com/#basic-example

  /* eslint-disable no-undef */
  import Vue from 'vue'
  import Pagination from './Pagination.vue'
  import VLink from './VLink.vue'
  import VueFlatpickr from 'vue-flatpickr'
  import { Select, Option } from 'element-ui'
  import VeeValidate from 'vee-validate';

  require("intl-tel-input");
  require("element-ui");

  Vue.use(Select);
  Vue.use(Option);
  Vue.use(VeeValidate);

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
        isNew: false,
        status: 'D',
        categories: [{
          value: 'hardware',
          label: 'Hardware'
        },{
          value: 'software',
          label: 'Software'
        }],
        subcategories: [],
        hardwarecategories: [{
          value: 'computadores',
          label: 'Computadores'
        },{
          value: 'impressoras',
          label: 'Impressoras'
        },{
          value: 'componentes',
          label: 'Componentes e peças'
        }],
        softwarecategories: [{
          value: 'edicao',
          label: 'Edição de Imagens'
        },{
          value: 'suites',
          label: 'Suítes office'
        },{
          value: 'video',
          label: 'Produção de vídeo'
        },{
          value: 'virus',
          label: 'Anti-virus'
        },{
          value: 'util',
          label: 'Utilitários'
        }],
        fpOptions: {
          minDate: '1950-01-01',
          maxDate: '2100-12-31',
          dateFormat: 'd/m/Y',
          allowInput: true,
          enableTime: false,
          time_24hr: true
        }
      }
    },
    directives: {
      mask: {
        // https://gist.github.com/logaretm/13f9f0fa1df5b1ecf1e5#file-directives-js
        // bind, inserted, update, unbind
        update: function (el,maskval) {
          $(el).mask(maskval.value, {reverse:false});
        }
      },
      maskrev: {
        update: function (el,maskval) {
          $(el).mask(maskval.value, {reverse:true});
        }
      },
      intlphone: {
        // https://github.com/jackocnr/intl-tel-input
        // https://github.com/jackocnr/intl-tel-input/blob/master/demo.html
        // bind, inserted, update, unbind
        update: function (el) {
          // https://raw.githubusercontent.com/jackocnr/intl-tel-input/master/build/js/utils.js
          //$.fn.intlTelInput.loadUtils(intl_tel_utils_path);
          //$(el).intlTelInput();

          var intl_tel_utils_path = 'https://cdnjs.cloudflare.com/ajax/libs/intl-tel-input/8.4.6/js/utils.js';
          var telInput = $(el);
          var errorMsg = $('#invalid-phone');
          var validMsg = $('#valid-phone');

          telInput.intlTelInput({utilsScript: intl_tel_utils_path, initialCountry: 'BR', nationalMode: true, autoPlaceholder: 'aggressive' });

          var reset = function() {
            telInput.removeClass("error");
            errorMsg.addClass("is-hidden");
            validMsg.addClass("is-hidden");
          };

          var currentFormat = function() {
            var placeholder = telInput.attr('placeholder');
            placeholder = placeholder.replace(new RegExp("[0-9]", "g"), "0");
            return placeholder;
          };

          var isBR = function() {
            var val = $.trim(telInput.val());
            var data = telInput.intlTelInput("getSelectedCountryData");
            if (data.dialCode == 55 && (val.length == 11 || val.length == 10)) {
                return true;
            }
            return false;
          }

          var SPMaskBehavior = function (val) {
            return val.replace(/\D/g, '').length === 11 ? '(00) 00000-0000' : '(00) 0000-00009';
          }, spOptions = {
              onKeyPress: function(val, e, field, options) {
                field.mask(SPMaskBehavior.apply({}, arguments), options);
              }
          };

          var mask = function() {
            // FIX for BR number (changing placeholder value)
            // http://www.anatel.gov.br/setorregulado/index.php/nono-digito
            if (isBR()) {
              telInput.mask(SPMaskBehavior, spOptions);
            }else {
              telInput.mask(currentFormat(), {reverse:false});
            }
          };

          telInput.change(function() {
            // setup mask only once from placeholder's current value
            reset();
          });

          // on blur: validate
          telInput.blur(function() {
            reset();
            if ($.trim(telInput.val())) {
              //console.log(telInput.val());
              //console.log(telInput.intlTelInput("getNumber"));

              if (telInput.intlTelInput("isValidNumber") || isBR()) {
                validMsg.removeClass("is-hidden");
              } else {
                telInput.addClass("error");
                errorMsg.removeClass("is-hidden");
              }
            }
          });

        }
      }
    },
    components: {
      Pagination, VLink, 'datepicker': VueFlatpickr
    },
    mounted() {
      // hardcoded mask set with jquery
      //$('#unitValue').mask('#.##0,00', {reverse:true});
      //var intl_tel_utils_path = './../assets/js/intln-tel-input/utils.js';
      //$('#phone').intlTelInput({utilsScript: intl_tel_utils_path });
    },
    methods: {
      replaceSubcategories() {
        switch(this.selected.category) {
          case 'hardware':
            this.subcategories = this.hardwarecategories;
            break;
          case 'software':
            this.subcategories = this.softwarecategories;
            break;
          default:
            this.subcategories = this.hardwarecategories;
        }
      },
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
      clearValidation() {
        this.errors.clear();
      },
      saveProduct() {
        if (this.selected.id != null) { // EDIT A PRODUCT
          this.$http.put(`/products/${this.selected.id}`, this.selected).then(
            response => {
              this.$set(this, 'selected', {})
              this.$set(this, 'showModal', false)
              // OR (https://vuejs.org/v2/guide/migration.html#vm-set-changed)
              // this.selected = {}
              // this.showModal = false
            },
            error => {
              console.error(error)
            }
          ).finally(function () {
            this.loadProducts()
          })
        } else { // NEW PRODUCT
          // Validate All returns a promise and provides the validation result.
          this.$validator.validateAll().then(
            success => {
              if (!success) {
                // handle error
                return;
              }
              this.$http.post(`/products`, this.selected).then(
                response => {
                  this.$set(this, 'selected', {})
                  this.$set(this, 'showModal', false)
                },
                error => {
                  console.error(error)
                }
              ).finally(function () {
                this.clearValidation();
                this.loadProducts()
              })
          },
          error => {
            console.log('form validation triggered');
          });
        }
      }
    },
    created() {
      this.loadProducts()
    }
  }
</script>
