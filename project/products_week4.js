import { createApp } from 'https://unpkg.com/vue@3/dist/vue.esm-browser.js';
//匯入元件
import pagination from './pagination.js';

const site = 'https://vue3-course-api.hexschool.io/v2/';
const api_path = 'kill9ker123';

let productModal = {};
let delProductModal = {};

const app = createApp({
    data(){
        return {
            products:[],
            tempProducts:{
                imagesUrl:[],//因為API可以有帶入多張圖片，所以先寫，避免出錯
            },
            isNew:false,//確認是新增還是編輯
            page:{},
        };
    },
    components:{pagination},//註冊區域元件
    methods:{
        getProducts(page=1){//參數預設值
            const url = `${site}api/${api_path}/admin/products/?page=${page}`;
            // console.log(url);
            axios.get(url)
                .then((res)=>{
                    console.log(res);
                    this.products = res.data.products;
                    this.page = res.data.pagination;//要把分頁的功能存起來
                })
                .catch(err=>{
                    console.log(err.data.message);
                })
        },
        openModal(status,product){//透過太入參數來判斷不同的需要
            if(status === 'create'){
                productModal.show();
                this.isNew = true;
                //會帶入初始化資料
                this.tempProducts = {
                    imagesUrl:[],
                }
            } else if(status === 'edit'){
                productModal.show();
                this.isNew = false;
                //會帶入當前要編輯的資料，要用展開帶入，不然因為v-model會雙向綁定動到
                this.tempProducts = {...product};
            }else if(status === 'delete'){
                delProductModal.show();
                this.tempProducts = {...product};//把這個物件傳進來這個modal，主要是為了取id使用
            }
        },
        updateProduct(){
            let url = `${site}api/${api_path}/admin/product`;
            //用isNew這變數來判斷API要怎麼運行
            let method = 'post';
            if(!this.isNew){
                url = `${site}api/${api_path}/admin/product/${this.tempProducts.id}`;
                method = 'put';
            }
            axios[method](url,{data:this.tempProducts})//用變數來帶方法 所以上面let
            .then(res=>{
                // console.log(res);
                this.getProducts();
                productModal.hide();
            })
        },
        deleteProduct(){
            const url = `${site}api/${api_path}/admin/product/${this.tempProducts.id}`;
            axios.delete(url)
            .then(res=>{
                this.getProducts();
                delProductModal.hide();
            })
        }
    },
    mounted(){
        const cookieValue = document.cookie
            .split('; ')
            .find((row) => row.startsWith('myToken='))
            ?.split('=')[1];
        // console.log(cookieValue);
        axios.defaults.headers.common['Authorization'] = cookieValue;
        this.getProducts();
        //Bootstrap方法
        productModal = new bootstrap.Modal('#productModal');
        // productModal.show();//確保他會動
        delProductModal = new bootstrap.Modal('#delProductModal');
        // productModal.show();
    }
});
app.component('product-modal',{
    props:['tempProducts','updateProduct'],
    template:`#product-modal-template`//元件要怎麼加入html?
})

app.mount('#app');