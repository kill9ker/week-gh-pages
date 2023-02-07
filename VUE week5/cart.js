import { createApp } from 'https://unpkg.com/vue@3/dist/vue.esm-browser.js';

// import { createApp } from 'https://cdnjs.cloudflare.com/ajax/libs/vue/3.2.29/vue.esm-browser.min.js';

//驗證驗證文件規則
Object.keys(VeeValidateRules).forEach(rule => {
  if (rule !== 'default') {
    VeeValidate.defineRule(rule, VeeValidateRules[rule]);
  }
});
// 讀取外部的資源
VeeValidateI18n.loadLocaleFromURL('./zh_TW.json');

// Activate the locale
VeeValidate.configure({
  generateMessage: VeeValidateI18n.localize('zh_TW'),
  validateOnInput: true, // 調整為：輸入文字時，就立即進行驗證
});

const apiUrl = 'https://vue3-course-api.hexschool.io';
const apiPath = 'kill9ker123';

const productModal = {
    props:['id','addToCart'],//接收一個id 當id有變動時 取得遠端資料並呈現modal
    data(){
        return {
            modal:{},//需要一個位置把modal賦予到此
            tempProduct:{},
            qty:1,//讓購物車數量有預設值
        };
    },
    template:'#userProductModal',
    watch:{
        id(){
            console.log('productModal:',this.id);
            axios.get(`${apiUrl}/v2/api/${apiPath}/product/${this.id}`).then(
                (res) => {
                    console.log('單一產品:',res.data.product);
                    this.tempProduct = res.data.product; //從遠端取到的資料再放到自己預設建的資料
                });
                this.modal.show();
        }
    },
    methods:{
        hide(){
            this.modal.hide();
        }
    },
    mounted(){//這個生命週期是要把modal做生成
        this.modal = new bootstrap.Modal(this.$refs.modal);//裡面可以放id也可以用ref的方式
        // this.modal.show()
        
    },
}

const app = createApp({
    data(){
        return{
            user:{
                name: '',
                email: '',
                tel: '',
                address: '',
            },
            message: '',
            products:[],
            productId:'',//這是我們選擇的id，然後選到這id，就把外層的這個id傳進去元件裡去呈現modal
            cart:{},//把購物車定義
            loadingItem:''//存id 
        }
    },
    methods:{
        getProducts(){
            axios.get(`${apiUrl}/v2/api/${apiPath}/products/all`).then(
                (res) => {
                    console.log('產品列表:',res.data.products);
                    this.products = res.data.products; //從遠端取到的資料再放到自己預設建的資料
                });
        },
        openModal(id){
            this.productId = id;
            console.log('外層帶入productId:',id) //把id傳到元件要怎麼在html上寫？？
        },
        addToCart(product_id,qty=1){
            const data = {
                product_id,//縮寫形式 因為跟參數同名所以不用在寫第二次
                qty,
            };
            axios.post(`${apiUrl}/v2/api/${apiPath}/cart`,{ data }).then(
                (res) => {
                    console.log('加入購物車:',res.data);
                    this.$refs.productModal.hide();
                    this.getCarts()
            });
        },
        getCarts(){
            axios.get(`${apiUrl}/v2/api/${apiPath}/cart`).then(
                (res) => {
                    console.log('購物車:',res.data);
                    this.cart = res.data.data;
                });
        },
        updateCartItem(item){//購物車的id 產品的id
            const data = {
                product_id:item.product.id,//縮寫形式 因為跟參數同名所以不用在寫第二次
                qty:item.qty,
            };
            // console.log(data,item.id);//確認要送的資料是否符合api要求
            this.loadingItem = item.id;//剛剛觸發時就把此id存起來
            axios.put(`${apiUrl}/v2/api/${apiPath}/cart/${item.id}`,{data}).then(
                (res) => {
                    console.log('更新購物車:',res.data)
                    this.getCarts()
                    this.loadingItem ='';//等axios跑完在清空
                });
        },
        deleteItem(item){
            this.loadingItem = item.id;
            axios.delete(`${apiUrl}/v2/api/${apiPath}/cart/${item.id}`).then(
                (res) => {
                    console.log('刪除購物車:',res.data)
                    this.getCarts();
                    this.loadingItem ='';
                });
        },
        onSubmit(){
            console.log("送出表單");
            const url = `${apiUrl}/api/${apiPath}/order`;
            const order = this.form;
            axios.post(url, { data: order }).then((response) => {
                alert(response.data.message);
                this.$refs.form.resetForm();
                this.getCart();
            }).catch((err) => {
                alert(err.response.data.message);
            });

        },
    },    
    components:{
        productModal,
    },
    mounted(){
        this.getProducts();
        this.getCarts();
    }
});
app.component('VForm', VeeValidate.Form);
app.component('VField', VeeValidate.Field);
app.component('ErrorMessage', VeeValidate.ErrorMessage);
app.mount('#app');

