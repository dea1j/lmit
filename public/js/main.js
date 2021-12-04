var app = new Vue({
  data: {
    readTermsAndCondition: false,
    step: 1,
    takeTest: null,
    fullName: "",
    email: "",
    phone: "",
    gender: "",
    qualification: "",
  },
  methods: {
    createUser() {
        const payload = {
            fullName: this.fullName,
            email: this.email,
            phone: this.phone,
            gender: this.gender,
            qualification: this.qualification
        }
        this.$emit('savedStudent', payload)
        this.clearForm();
        this.nextStep()
    },
    clearForm() {
        this.fullName = "",
        this.email = "",
        this.phone = "",
        this.gender = "",
        this.qualification = ""
    },
    nextStep() {
      this.step += 1;
    },
    prevStep() {
      this.step -= 1;
    },
  },
}).$mount("#app");

const handleBackBtn = (id)=> {
  let url = `http:localhost:3000/quiz/back/${id}`
  console.log(url)
  fetch(url)
  .then(response => response.json())
  .then(data => console.log(data));
}