<template>
  <v-container fluid fill-height>
    <v-slide-y-transition mode="out-in">
      <v-layout column align-center>
        <v-card max-width="320" class="pa-5">
          <v-form
            v-if="!loading"
            v-model="valid"
            lazy-validation
            @submit.prevent="signUp"
            @keydown.prevent.enter
          >
            <h3>Register</h3>
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
            <v-btn type="submit" :disabled="!valid" class="mx-auto"
              >Sign Up</v-btn
            >
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
    </v-slide-y-transition>
  </v-container>
</template>

<script>
import { validEmail, validPassword } from "../validators";
export default {
  data() {
    return {
      loading: false,
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
  methods: {
    submitForm() {}
  }
};
</script>

<style lang="scss" scoped>
</style>
