<script setup lang="ts">
import { useData } from 'vitepress'
import { onMounted, onUnmounted, ref } from 'vue'

const { frontmatter } = useData()

const activeSection = ref('')

const navItems = [
  { id: 'profile', label: '个人概要' },
  { id: 'projects', label: '重点项目' },
  { id: 'experience', label: '工作经历' },
  { id: 'education', label: '教育背景' },
  { id: 'skills', label: '工具与技能' },
]

let observer: IntersectionObserver | null = null

const showLightbox = ref(false)
const lightboxSrc = ref('')
const lightboxCaption = ref('')

const showDrawer = ref(false)
const drawerSrc = ref('')
const drawerTitle = ref('')

function openLightbox(src: string, caption: string) {
  lightboxSrc.value = src
  lightboxCaption.value = caption
  showLightbox.value = true
  document.body.style.overflow = 'hidden'
}

function closeLightbox() {
  showLightbox.value = false
  document.body.style.overflow = ''
}

function openDrawer(src: string, title: string) {
  drawerSrc.value = src
  drawerTitle.value = title
  showDrawer.value = true
  document.body.style.overflow = 'hidden'
}

function closeDrawer() {
  showDrawer.value = false
  document.body.style.overflow = ''
}

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

  // Lightbox triggers
  document.querySelectorAll('.ss-trigger').forEach((btn) => {
    btn.addEventListener('click', () => {
      const src = btn.getAttribute('data-img')
      const caption = btn.getAttribute('data-caption')
      if (src) openLightbox(src, caption || '')
    })
  })

  // Ability tag cloud
  document.querySelectorAll('.ability-tag').forEach((tag) => {
    tag.addEventListener('click', (e) => {
      e.preventDefault()
      const ability = tag.getAttribute('data-ability')
      if (!ability) return

      // Deactivate all tags, activate clicked
      document.querySelectorAll('.ability-tag').forEach(t => t.classList.remove('active'))
      tag.classList.add('active')

      // Remove highlight from all projects
      document.querySelectorAll('.project.highlight').forEach(p => p.classList.remove('highlight'))

      // Find all matching projects
      const matches = document.querySelectorAll(`.project[data-abilities*="${ability}"]`)
      if (matches.length === 0) return

      // Scroll to first match
      matches[0].scrollIntoView({ behavior: 'smooth', block: 'start' })

      // Highlight all matching projects
      setTimeout(() => matches.forEach(m => m.classList.add('highlight')), 300)
      setTimeout(() => {
        matches.forEach(m => m.classList.remove('highlight'))
        tag.classList.remove('active')
      }, 2000)
    })
  })

  // Drawer triggers
  document.querySelectorAll('.project.has-drawer').forEach((card) => {
    card.addEventListener('click', (e) => {
      const target = e.target as HTMLElement
      if (target.closest('.ss-trigger') || target.closest('button')) return
      const src = card.getAttribute('data-drawer-src')
      const title = card.getAttribute('data-drawer-title')
      if (src) openDrawer(src, title || '')
    })
  })

  // Esc to close
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      if (showLightbox.value) closeLightbox()
      else if (showDrawer.value) closeDrawer()
    }
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

    <!-- Lightbox -->
    <Teleport to="body">
      <div
        class="lightbox-overlay"
        :class="{ show: showLightbox }"
        @click.self="closeLightbox"
      >
        <div class="lightbox-content">
          <button class="lightbox-close" @click="closeLightbox" aria-label="关闭">✕</button>
          <img v-if="showLightbox" :key="lightboxSrc" :src="lightboxSrc" :alt="lightboxCaption" />
          <div class="lightbox-caption" v-if="lightboxCaption">{{ lightboxCaption }}</div>
        </div>
      </div>
    </Teleport>

    <!-- Drawer -->
    <Teleport to="body">
      <div class="drawer-backdrop" :class="{ show: showDrawer }" @click="closeDrawer"></div>
      <div class="drawer-panel" :class="{ show: showDrawer }">
        <div class="drawer-close">
          <span style="font-weight:640;font-size:0.85rem;color:var(--ink);flex:1">{{ drawerTitle }}</span>
          <button @click="closeDrawer" aria-label="关闭">✕</button>
        </div>
        <div class="drawer-body">
          <iframe :src="drawerSrc" title="分析链路图"></iframe>
        </div>
      </div>
    </Teleport>
  </div>
</template>
