<template>
  <div>
    <Navigation/>
    <div class="max-w-lg mx-auto py-6 sm:px-6 lg:px-8 relative">
      <PasswordRecoveryWidget></PasswordRecoveryWidget>
    </div>
    <Footer></Footer>
  </div>
</template>


<script>
import PasswordRecoveryWidget from '@/components/identity/InitPasswordResetWidget';

export default {
  components: {PasswordRecoveryWidget},
}

</script>
