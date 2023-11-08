<script setup lang="ts">
import OT from '@opentok/client';

const API_KEY = '';
const SESSION_ID = '';
const TOKEN = '';

function handleError(error) {
  if (error) {
    console.error(error);
  }
}

function initializeSession() {
  const session = OT.initSession(API_KEY, SESSION_ID);

  session.on('streamCreated', (event) => {
    const subscriberOptions = {
      insertMode: 'append',
      width: '100%',
      height: '100%'
    };
    session.subscribe(event.stream, 'subscriber', subscriberOptions, handleError);
  });

  session.on('sessionDisconnected', (event) => {
    console.log('You were disconnected from the session.', event.reason);
  });

  const publisherOptions = {
    insertMode: 'append',
    width: '100%',
    height: '100%'
  };

  const publisher = OT.initPublisher('publisher', publisherOptions, handleError);

  session.connect(TOKEN, (error) => {
    if (error) {
      handleError(error);
    } else {
      session.publish(publisher, handleError);
    }
  });
}

initializeSession();

</script>

<template>
  <main>
    <h1>Meeting</h1>
    <div id="videos">
        <div id="subscriber"></div>
        <div id="publisher"></div>
    </div>
  </main>
</template>
