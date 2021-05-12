<template>
  <v-container fluid fill-height>
    <v-layout column align-center>
      <v-card max-width="320" class="pa-5" v-if="!loading">
        <v-form
          v-model="valid"
          lazy-validation
          class="form"
          @submit.prevent="submitForm"
          @keydown.prevent.enter
        >
          <h2>Register</h2>
          <v-text-field
            v-model="user.email"
            :rules="rules.emailRules"
            label="Email"
            required
          ></v-text-field>
          <v-text-field
            v-model="user.password"
            :rules="rules.passwordRules"
            label="Password"
            type="password"
            required
          ></v-text-field>
          <div class="text-center">
            <v-btn type="submit" :disabled="!valid" color="primary"
              >Sign Up</v-btn
            >
          </div>
        </v-form>
      </v-card>
      <v-progress-circular
        v-if="loading"
        :size="70"
        :width="7"
        indeterminate
        color="primary"
      >
      </v-progress-circular>
    </v-layout>
  </v-container>
</template>

<script>
import { validEmail, validPassword } from "../validators";
import { mapState, mapActions } from "vuex";

export default {
  data() {
    return {
      valid: false,
      user: {
        email: "",
        password: ""
      },
      rules: {
        emailRules: [
          v => !!v || "E-mail is required",
          v => validEmail(v) || "E-mail must be valid"
        ],
        passwordRules: [
          v => !!v || "Password is required",
          v => v.trim().length >= 6 || "Password need at least 6 characters",
          v => validPassword(v) || "Password must be valid"
        ]
      }
    };
  },
  computed: {
    ...mapState("users", { loading: "isCreatePending" })
  },
  methods: {
    ...mapActions("users", ["create"]),
    submitForm() {
      if (this.valid) {
        const { User } = this.$FeathersVuex.api;
        const user = new User(this.user);
        user
          .save()
          .then(user => {
            console.log(user);
            this.$router.push("/login");
          })
          .catch(e => {
            if (e.code === 409) {
              this.$toasted.global.error("email already exist!");
              return;
            }
            this.$toasted.global.error(e.message);
          });
      }
    }
  }
};
</script>

<style lang="scss" scoped>
h2 {
  text-align: center;
  margin-bottom: 16px;
}
.form {
  width: 280px;
}
</style>
