<script setup lang="ts">
	import { Moon, Sun, Monitor } from 'lucide-vue-next'

	const colorMode = useColorMode()
</script>

<template>
	<DropdownMenu>
		<DropdownMenuTrigger as-child>
			<Button variant="ghost" size="icon">
				<Sun class="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
				<Moon class="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
				<span class="sr-only">Toggle theme</span>
			</Button>
		</DropdownMenuTrigger>
		<DropdownMenuContent align="end">
			<DropdownMenuItem @click="colorMode.preference = 'light'">
				<Sun class="mr-2 h-4 w-4" />
				<span>Claro</span>
			</DropdownMenuItem>
			<DropdownMenuItem @click="colorMode.preference = 'dark'">
				<Moon class="mr-2 h-4 w-4" />
				<span>Oscuro</span>
			</DropdownMenuItem>
			<DropdownMenuItem @click="colorMode.preference = 'system'">
				<Monitor class="mr-2 h-4 w-4" />
				<span>Sistema</span>
			</DropdownMenuItem>
		</DropdownMenuContent>
	</DropdownMenu>
</template>