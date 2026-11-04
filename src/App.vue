<script setup lang="ts">
import AboutSection from './components/AboutSection.vue'
import EducationSection from './components/EducationSection.vue'
import ExperienceSection from './components/ExperienceSection.vue'
import HobbiesSection from './components/HobbiesSection.vue'
import SectionDivider from './components/SectionDivider.vue'
import SkillsSection from './components/SkillsSection.vue'
import TheHeader from './components/TheHeader.vue'
</script>

<template>
  <TheHeader />
  <main>
    <AboutSection />
    <SectionDivider />
    <SkillsSection />
    <SectionDivider />
    <ExperienceSection />
    <SectionDivider />
    <EducationSection />
    <SectionDivider />
    <HobbiesSection />
  </main>
</template>
