<script setup lang="ts">
import { useData } from 'vitepress'
import { onMounted, onUnmounted, ref } from 'vue'

const { frontmatter } = useData()

const activeSection = ref('')

const navItems = [
  { id: 'profile', label: '个人概要' },
  { id: 'strengths', label: '核心能力' },
  { id: 'projects', label: '重点项目' },
  { id: 'experience', label: '工作经历' },
  { id: 'education', label: '教育背景' },
  { id: 'skills', label: '工具与技能' },
]

let observer: IntersectionObserver | null = null

onMounted(() => {
  observer = new IntersectionObserver(
    (entries) => {
      const visible = entries
        .filter((e) => e.isIntersecting)
        .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top)
      if (visible.length > 0) {
        activeSection.value = visible[0].target.id
      }
    },
    { rootMargin: '-20% 0px -70% 0px', threshold: 0 }
  )

  navItems.forEach((item) => {
    const el = document.getElementById(item.id)
    if (el) observer?.observe(el)
  })

  // Copy functionality
  document.querySelectorAll('.copy-btn').forEach((btn) => {
    btn.addEventListener('click', async () => {
      const text = btn.getAttribute('data-copy')
      if (!text) return
      try {
        await navigator.clipboard.writeText(text)
        btn.classList.add('copied')
        setTimeout(() => btn.classList.remove('copied'), 1500)
      } catch {
        // Fallback for older browsers
        const ta = document.createElement('textarea')
        ta.value = text
        ta.style.position = 'fixed'
        ta.style.opacity = '0'
        document.body.appendChild(ta)
        ta.select()
        document.execCommand('copy')
        document.body.removeChild(ta)
        btn.classList.add('copied')
        setTimeout(() => btn.classList.remove('copied'), 1500)
      }
    })
  })
})

onUnmounted(() => {
  observer?.disconnect()
})
</script>

<template>
  <div class="resume-page">
    <nav class="side-nav" aria-label="页面导航">
      <ul class="side-nav-list">
        <li v-for="item in navItems" :key="item.id">
          <a
            :href="'#' + item.id"
            :class="{ active: activeSection === item.id }"
          >{{ item.label }}</a>
        </li>
      </ul>
    </nav>
    <Content />
  </div>
</template>
