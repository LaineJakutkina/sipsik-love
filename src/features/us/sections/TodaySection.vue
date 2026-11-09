<script setup lang="ts">
import CoatCard from "@/features/coats/CoatCard.vue";
import DailyQuestion from "../components/DailyQuestion.vue";
import DailyTasks from "../components/DailyTasks.vue";
import GenderCard from "../components/GenderCard.vue";
import InviteCard from "@/features/settings/InviteCard.vue";
import ItemsCard from "../components/ItemsCard.vue";
import MissedCard from "../components/MissedCard.vue";
import MoodPicker from "../components/MoodPicker.vue";
import NoteCard from "../components/NoteCard.vue";
import QuickActions from "../components/QuickActions.vue";
import ReceivedNotes from "../components/ReceivedNotes.vue";
import SelfCareCard from "../components/SelfCareCard.vue";
import SoonCard from "../components/SoonCard.vue";
import SupportCard from "../components/SupportCard.vue";
import TalkCard from "../components/TalkCard.vue";
import ThanksPrompt from "../components/ThanksPrompt.vue";
import TipsCard from "../components/TipsCard.vue";
import UsStats from "../components/UsStats.vue";
</script>

<template>
  <MissedCard />
  <InviteCard />
  <GenderCard />
  <TipsCard />
  <UsStats />
  <QuickActions />
  <MoodPicker />
  <SelfCareCard />
  <SupportCard />
  <TalkCard />
  <ThanksPrompt />
  <NoteCard />
  <DailyTasks />
  <DailyQuestion />
  <ReceivedNotes />
  <SoonCard />
  <CoatCard />
  <ItemsCard />
</template>
