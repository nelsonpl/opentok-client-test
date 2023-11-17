<script setup lang="ts">
import OT, { type PublisherProperties, type SubscriberProperties } from '@opentok/client'
import { ref, onMounted } from 'vue'
import { useToggle } from '@vueuse/core'

const API_KEY = import.meta.env.VITE_OPENTOK_API_KEY
const SESSION_ID = import.meta.env.VITE_OPENTOK_SESSION_ID
const TOKEN = import.meta.env.VITE_OPENTOK_TOKEN

const subscriberDiv = ref<HTMLElement>()
const publisherDiv = ref<HTMLElement>()
let publisher: OT.Publisher
let session: OT.Session
const [backgroundBlurStatus, toggleBackgroundBlur] = useToggle(false)

function handleError(error: any) {
  console.error(error)
}

function initializeSession() {
  session = OT.initSession(API_KEY, SESSION_ID)

  session.on('streamCreated', (event) => {
    const subscriberOptions: SubscriberProperties = {
      insertMode: 'append',
      width: '100%',
      height: '100%'
    }
    session.subscribe(
      event.stream,
      subscriberDiv.value as HTMLElement,
      subscriberOptions,
      handleError
    )
  })

  session.on('sessionDisconnected', (event) => {
    console.log('You were disconnected from the session.', event.reason)
  })

  const publisherOptions: PublisherProperties = {
    insertMode: 'append',
    width: '100%',
    height: '100%'
  }

  publisher = OT.initPublisher(publisherDiv.value as HTMLElement, publisherOptions, handleError)

  session.connect(TOKEN, (error) => {
    if (error) {
      handleError(error)
    } else {
      session.publish(publisher, handleError)
    }
  })
}

const backgroundBlur = () => {
  if (toggleBackgroundBlur()) {
    publisher.applyVideoFilter({
      type: 'backgroundBlur',
      blurStrength: 'high'
    })
  }
  else {
    setTimeout(() => publisher.clearVideoFilter(), 1000)
  }
}

const shareScreen = () => {}

const endCall = () => {}

onMounted(() => {
  initializeSession()
})
</script>

<template>
  <main>
    <h1>Meeting</h1>
    <div id="videos">
      <div id="subscriber" ref="subscriberDiv"></div>
      <div id="publisher" ref="publisherDiv"></div>
    </div>
    <div id="actions">
      <button id="backgroundBlur" @click="backgroundBlur">background Blur {{ backgroundBlurStatus? 'On': 'Off' }}</button>
      <button id="shareScreen" @click="shareScreen">Share Screen</button>
      <button id="endCall" @click="endCall">End Call</button>
    </div>
  </main>
</template>

<style scoped>

#videos {
    width: 100%;
    height: 100%;
    margin-left: auto;
    margin-right: auto;
}

#subscriber {
    position: absolute;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    z-index: 10;
}

#publisher {
    position: absolute;
    width: 640px;
    height: 480px;
    bottom: 40px;
    left: auto;
    right: 10px;
    z-index: 100;
    border: 3px solid white;
    border-radius: 3px;
}

#actions {
    position: absolute;
    bottom: 10px;
    right: 10px;
    z-index: 100;
}

#actions button {
    margin: 5px;
}
</style>
