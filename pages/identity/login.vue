<template>
  <div>
    <Navigation/>
    <div class="max-w-lg mx-auto py-6 sm:px-6 lg:px-8 relative">
      <LoginWidget></LoginWidget>
    </div>
    <Footer></Footer>
  </div>
</template>


<script>
import LoginWidget from '../../components/identity/LoginWidget';

export default {
  components: {LoginWidget},
}

</script>
