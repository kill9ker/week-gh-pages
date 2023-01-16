import { createApp } from 'https://unpkg.com/vue@3/dist/vue.esm-browser.js';

const site = 'https://vue3-course-api.hexschool.io/v2/';

const app = createApp({
    data(){
        return {
            user:{
                username: '',
                password: '',
            }
        }
    },
    methods:{
        login(){
            console.log('有按到');
            console.log(this.user);
            const url = `${site}admin/signin`;
            axios.post(url,this.user)
             .then((res)=>{
                 const { expired, token} = res.data;
                //  console.log(expired,token);
                 document.cookie = `myToken=${token};expires=${new Date(expired)};`;
                 window.location='./week3.html';
            })
            .catch(err=>{
                console.log(err);
            })
        },
        // checkLogin(){
        //     // console.log(`${site}api/user/check`);
        //     const url = `${site}api/user/check`;
        //     axios.post(url)
        //         .then(res=>{
        //             console.log(res);
        //             this.getProducts();
        //         })
        //         .catch(err=>{
        //             window.location='./login.html'
        //         });
        // },
        // login(){
        //     console.log('有按到');
        //     console.log(this.user);
        //     const url = `${site}admin/signin`;
        //     axios.post(url,this.user)
        //         .then((res)=>{
        //          const { expired, token} = res.data;
        //          document.cookie = `myToken=${token},expires=${new Data(expired)}`;
        //          window.location='./week3.html'
        //         })
        //         .catch(err=>{
        //             console.log(err);
        //         })
        // },
    },
    mounted(){
        // console.log(`${site}admin/signin`);
        // console.log(this.user);
    }
});

app.mount('#app');