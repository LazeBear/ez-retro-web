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
          <h2>Login</h2>
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
              >Login</v-btn
            >
          </div>
        </v-form>
      </v-card>
      <v-progress-circular
        v-else
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
    ...mapState("auth", { loading: "isAuthenticatePending" })
  },
  methods: {
    ...mapActions("localAuth", ["login"]),
    submitForm() {
      if (this.valid) {
        this.$store
          .dispatch("auth/authenticate", {
            strategy: "local",
            ...this.user
          })
          .then(() => {
            const redirect = sessionStorage.getItem("redirect");
            this.$router.push(redirect || "/boards");
          })
          .catch(e => {
            console.error("Authentication error", e);
            this.$toasted.global.error("Invalid password or email!");
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
