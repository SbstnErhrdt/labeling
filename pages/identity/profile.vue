<template>
  <div>
    <Navigation></Navigation>
    <div class="px-6">
      <div class="mx-auto py-6">
        <div class="grid gap-4 grid-cols-1 md:grid-cols-2">
          <div>
            <ProfileWidget></ProfileWidget>
          </div>
          <div>
            <ChangePasswordWidget></ChangePasswordWidget>
          </div>
        </div>
      </div>
    </div>
    <Footer></Footer>
  </div>
</template>

<script>
import ProfileWidget from '../../components/identity/ProfileWidget';
import ChangePasswordWidget from '@/components/identity/ChangePasswordWidget';

export default {
  components: {ChangePasswordWidget, ProfileWidget},
  head: {
    title: 'Update User Profile'
  }
}</script>
