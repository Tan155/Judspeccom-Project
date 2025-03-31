<template>
  <v-container v-if="isVisit">
    <v-navigation-drawer app permanent>
      <v-list>
        <v-list-item>
          <v-avatar size="40">
            <v-img :src="profileImage" alt="profile" />
          </v-avatar>
        </v-list-item>

        <v-list-item-title style="position: absolute; left: 75px; top: 10px">
          {{ username }}
        </v-list-item-title>

        <v-list-item-subtitle style="position: absolute; left: 75px; top: 35px">
          {{ email }}
        </v-list-item-subtitle>
      </v-list>

      <v-divider />

      <v-list nav>
        <v-list-item v-for="(item, i) in items" :key="i" :value="item.value" color="primary"
          @click="selectedItem = item.value">
          <template #prepend>
            <v-icon :icon="item.icon" />
          </template>
          <v-list-item-title v-text="item.text" />
        </v-list-item>
      </v-list>
    </v-navigation-drawer>

    <!-- main -->

    <!-- My profile -->
    <v-container v-if="selectedItem == 'profile'" fluid class="pa-5"
      style="min-height: 100vh; background-color: #121212; color: white; transform: translateX(-13%);">
      <v-row>
        <v-col cols="12">
          <h1 style="font-size: 48px;">
            My Profile
          </h1>
        </v-col>
      </v-row>
      <v-row class="fill-height" align="center" justify="center" no-gutters>
        <!-- Left: Text Section -->
        <v-col cols="12" md="6" class="d-flex flex-column justify-center pl-md-16 pr-md-10 px-6">
          <div>
            <h1 class="profile-name">
              {{ username }}
              <span class="underline-highlight" />
            </h1>
            <h2 class="profile-title mt-2">
              {{ email }}
            </h2>

            <v-btn class="email-verified d-flex align-center mt-6 cursor-grab">
              <v-icon size="28" color="green-lighten-2" class="mr-2">
                mdi-check-decagram
              </v-icon>
              <span class="verified-text">Email verified successfully</span>
            </v-btn>
          </div>
        </v-col>
        <!-- Right: Profile Image Box -->
        <v-col cols="12" md="6" class="d-flex flex-column align-center mt-6 mt-md-0">
          <div class="profile-box">
            <img :src="profileImage" class="profile-img">
          </div>

          <!-- ปุ่มอยู่ใต้รูป -->
          <div class="mt-4">
            <v-btn class="upload-btn text-none" color="#1A237E" :loading="uploading">
              Change Picture
              <input type="file" class="file-input" accept="image/*" @change="uploadImage">
            </v-btn>
          </div>
        </v-col>
      </v-row>
    </v-container>


    <!-- List Users -->
    <v-card v-if="selectedItem == 'listUser'" class="pd-6" style="margin-left: -250px; ">
      <v-card-title class="headline text-center">
        List Users
      </v-card-title>

      <v-text-field v-model="searchUser" label="🔍 Search Username" variant="outlined" clearable
        prepend-inner-icon="mdi-magnify" class="mb-4" />

      <thead>
        <tr>
          <th style="position: absolute;  left: 50px;">
            🔢 ID
          </th>
          <th style="position: absolute;  left: 350px;">
            👤 Username
          </th>
          <th style="position: absolute;  right: 560px;">
            📧 Email
          </th>
          <th style="position: absolute;  right: 150px;">
            ⚙️ Actions
          </th>
        </tr>
      </thead>
      <v-data-table :headers="headers" :items="filteredUsers" item-value="email" class="elevation-1">
        <template #item.actions="{ item }">
          <v-btn color="red" @click="deleteUsers(item.email)">
            <v-icon>mdi-delete</v-icon> DELETE
          </v-btn>
        </template>
      </v-data-table>
    </v-card>

    <!-- Check Stock -->
    <v-card v-if="selectedItem == 'checkStock'" class="pa-6" style="margin-left: -250px; ">
      <v-card-title class="headline text-center">
        Check Stock
      </v-card-title>

      <!-- Show Product-->
      <v-tabs v-model="selectedCategory" background-color="primary" dark>
        <v-tab v-for="(category, index) in categories" :key="index" :value="category.value">
          {{ category.text }}
        </v-tab>
      </v-tabs>

      <v-container>
        <v-text-field v-model="search" label="🔍 Search Product" variant="outlined" clearable
          prepend-inner-icon="mdi-magnify" class="mb-4" />
        <thead>
          <tr>
            <th style="position: absolute;  left: 50px;">
              🖼 Image
            </th>
            <th style="position: absolute;  left: 160px;">
              🔢 ID
            </th>
            <th style="position: absolute;  left: 420px;">
              📦 Name
            </th>
            <th style="position: absolute;  right: 250px;">
              💲 Price
            </th>
            <th style="position: absolute;  right: 120px;">
              ⚙️ Actions
            </th>
          </tr>
        </thead>
        <v-data-table :headers="headersProduct" :items="filteredProducts" item-value="_id" class="elevation-1 mt-4">
          <template #item.img="{ item }">
            <v-img :src="item.img" alt="Product Image" width="50" height="50" contain />
          </template>

          <template #item.actions="{ item }">
            <v-btn color="red" @click="deleteProducts(item._id, selectedCategory)">
              <v-icon>mdi-delete</v-icon> DELETE
            </v-btn>
          </template>
        </v-data-table>
      </v-container>
    </v-card>

    <!-- Add Stock -->
    <v-card v-if="selectedItem == 'addStock'" class="pa-6" style="margin-left: -250px;">
      <v-card-title class="haedline text-center">
        <v-icon left>
          mdi-plus
        </v-icon> Add New Product
      </v-card-title>

      <v-select v-model="selectedCategoryAdd" :items="categoriesAdd" label="Select Category" variant="outlined"
        prepend-inner-icon="mdi-view-list" class="mb-4" @update:model-value="updateFields" />

      <v-form ref="form">
        <v-text-field v-model="productData.name" label="Product Name" variant="outlined" class="mb-4"
          :rules="[v => !!v || 'Product Name is required']" />
        <v-text-field v-model="productData.price" label="Price ($)" variant="outlined"
          :rules="[v => !!v || 'Product Price is required']" class="mb-4" />
        <v-text-field v-model="productData.img" label="Product Image URL" variant="outlined"
          :rules="[v => !!v || 'Product img is required']" class="mb-4" />


        <!-- Field each category -->
        <template v-if="selectedCategoryAdd === 'cpu'">
          <v-select v-model="productData.additionalDetails.Brand" label="Brand" :items="['intel', 'amd']" type="String"
            :rules="[v => !!v || 'Product Brand is required']" />
          <v-text-field v-model="productData.additionalDetails.Series" label="Series" type="String"
            :rules="[v => !!v || 'Product Series is required']" />
          <v-text-field v-model="productData.additionalDetails.ProcessorNumber" label="ProcessorNumber" type="String"
            :rules="[v => !!v || 'Product ProcessorNumber is required']" />
          <v-text-field v-model="productData.additionalDetails.SocketType" label="SocketType" type="String"
            :rules="[v => !!v || 'Product SocketType is required']" />
          <v-text-field v-model="productData.additionalDetails.Cores" label="Cores" type="number"
            :rules="[v => !!v || 'Product Cores is required']" />
          <v-text-field v-model="productData.additionalDetails.Threads" label="Threads" type="number"
            :rules="[v => !!v || 'Product Threads is required']" />
          <v-text-field v-model="productData.additionalDetails.BaseFrequency" label="BaseFrequency" type="number"
            :rules="[v => !!v || 'Product BaseFrequency is required']" />
          <v-text-field v-model="productData.additionalDetails.MaxTurboFrequency" label="MaxTurboFrequency"
            type="number" :rules="[v => !!v || 'Product MaxTurboFrequency is required']" />
          <v-text-field v-model="productData.additionalDetails.L2Cache" label="L2Cache" type="number"
            :rules="[v => !!v || 'Product L2Cache is required']" />
          <v-text-field v-model="productData.additionalDetails.L3Cache" label="L3Cache" type="number"
            :rules="[v => !!v || 'Product L3Cache is required']" />
          <v-text-field v-model="productData.additionalDetails.GraphicsModels" label="GraphicsModels default 'N/A'"
            type="String" :rules="[v => !!v || 'Product GraphicsModels is required']" />
          <v-text-field v-model="productData.additionalDetails.Bit64Support" label="Bit64Support default 'N/A'"
            type="String" :rules="[v => !!v || 'Product Bit64Support is required']" />
          <v-text-field v-model="productData.additionalDetails.CPUCooler" label="CPUCooler default 'Yes'" type="String"
            :rules="[v => !!v || 'Product CPUCooler is required']" />
          <v-text-field v-model="productData.additionalDetails.MaximumTurboPower"
            label="MaximumTurboPower default 'N/A'" type="String"
            :rules="[v => !!v || 'Product MaximumTurboPower is required']" />
          <v-text-field v-model="productData.additionalDetails.Warranty" label="Warranty" type="String"
            :rules="[v => !!v || 'Product Warranty is required']" />
        </template>

        <template v-if="selectedCategoryAdd === 'gpu'">
          <v-text-field v-model="productData.additionalDetails.Brands" label="Brands" type="String"
            :rules="[v => !!v || 'Product Brands is required']" />
          <v-text-field v-model="productData.additionalDetails.GPUSeries" label="GPUSeries" type="String"
            :rules="[v => !!v || 'Product GPUSeries is required']" />
          <v-text-field v-model="productData.additionalDetails.GPUModel" label="GPUModel" type="String"
            :rules="[v => !!v || 'Product GPUModel is required']" />
          <v-text-field v-model="productData.additionalDetails.MemorySize" label="MemorySize" type="String"
            :rules="[v => !!v || 'Product MemorySize is required']" />
          <v-text-field v-model="productData.additionalDetails.MemoryType" label="MemoryType default GDDR6"
            type="String" :rules="[v => !!v || 'Product MemoryType is required']" />
          <v-text-field v-model="productData.additionalDetails.BusStandard" label="BusStandard" type="String"
            :rules="[v => !!v || 'Product BusStandard is required']" />
          <v-text-field v-model="productData.additionalDetails.CUDA_Cores" label="CUDA_Cores" type="String"
            :rules="[v => !!v || 'Product CUDA_Cores is required']" />
          <v-text-field v-model="productData.additionalDetails.MemoryInterface" label="MemoryInterface" type="String"
            :rules="[v => !!v || 'Product MemoryInterface is required']" />
          <v-text-field v-model="productData.additionalDetails.BoostClock" label="BoostClock" type="String"
            :rules="[v => !!v || 'Product BoostClock is required']" />
          <v-text-field v-model="productData.additionalDetails.BaseClock" label="BaseClock default N/A" type="String"
            :rules="[v => !!v || 'Product BaseClock is required']" />
          <v-text-field v-model="productData.additionalDetails.MemoryClock" label="MemoryClock" type="String"
            :rules="[v => !!v || 'Product MemoryClock is required']" />
          <v-text-field v-model="productData.additionalDetails.MaxDigitalResolution"
            label="MaxDigitalResolution default Unknown" type="String"
            :rules="[v => !!v || 'Product MaxDigitalResolution is required']" />
          <v-text-field v-model="productData.additionalDetails.HDMIPort" label="HDMIPort" type="String"
            :rules="[v => !!v || 'Product HDMIPort is required']" />
          <v-text-field v-model="productData.additionalDetails.DisplayPort" label="DisplayPort" type="String"
            :rules="[v => !!v || 'Product DisplayPort is required']" />
          <v-text-field v-model="productData.additionalDetails.CoolerFan" label="CoolerFan default Unknown"
            type="String" :rules="[v => !!v || 'Product CoolerFan is required']" />
          <v-text-field v-model="productData.additionalDetails.PowerConnector" label="PowerConnector default N/A"
            type="String" :rules="[v => !!v || 'Product PowerConnector is required']" />
          <v-text-field v-model="productData.additionalDetails.PowerRequirement" label="PowerRequirement" type="String"
            :rules="[v => !!v || 'Product PowerRequirement is required']" />
          <v-text-field v-model="productData.additionalDetails.Dimension" label="Dimension" type="String"
            :rules="[v => !!v || 'Product Dimension is required']" />
          <v-text-field v-model="productData.additionalDetails.Warranty" label="Warranty" type="String"
            :rules="[v => !!v || 'Product Warranty is required']" />
        </template>

        <template v-if="selectedCategoryAdd === 'ram'">
          <v-text-field v-model="productData.additionalDetails.Brand" label="Brand" type="String"
            :rules="[v => !!v || 'Product Brand is required']" />
          <v-text-field v-model="productData.additionalDetails.MemorySeries" label="MemorySeries" type="String"
            :rules="[v => !!v || 'Product MemorySeries is required']" />
          <v-text-field v-model="productData.additionalDetails.MemoryCapacity" label="MemoryCapacity" type="String"
            :rules="[v => !!v || 'Product MemoryCapacity is required']" />
          <v-text-field v-model="productData.additionalDetails.Speed" label="Speed default Unknown" type="String"
            :rules="[v => !!v || 'Product Speed is required']" />
          <v-text-field v-model="productData.additionalDetails.MemoryType" label="MemoryType" type="String"
            :rules="[v => !!v || 'Product MemoryType is required']" />
          <v-text-field v-model="productData.additionalDetails.CasLatency" label="CasLatency default Unknown"
            type="String" :rules="[v => !!v || 'Product CasLatency is required']" />
          <v-text-field v-model="productData.additionalDetails.TestedLatency" label="TestedLatency default Unknown"
            type="String" :rules="[v => !!v || 'Product TestedLatency is required']" />
          <v-text-field v-model="productData.additionalDetails.SPDVoltage" label="SPDVoltage default Unknown"
            type="String" :rules="[v => !!v || 'Product SPDVoltage is required']" />
          <v-text-field v-model="productData.additionalDetails.MemoryColor" label="MemoryColor" type="String"
            :rules="[v => !!v || 'Product MemoryColor is required']" />
          <v-text-field v-model="productData.additionalDetails.Warranty" label="Warranty" type="String"
            :rules="[v => !!v || 'Product Warranty is required']" />
        </template>

        <template v-if="selectedCategoryAdd === 'mainboard'">
          <v-text-field v-model="productData.additionalDetails.Brands" label="Brands" type="String"
            :rules="[v => !!v || 'Product Brands is required']" />
          <v-text-field v-model="productData.additionalDetails.CPUSupport" label="CPUSupport default Unknown"
            type="String" :rules="[v => !!v || 'Product CPUSupport is required']" />
          <v-text-field v-model="productData.additionalDetails.CPUSocket" label="CPUSocket" type="String"
            :rules="[v => !!v || 'Product CPUSocket is required']" />
          <v-text-field v-model="productData.additionalDetails.Chipset" label="Chipset" type="String"
            :rules="[v => !!v || 'Product Chipset is required']" />
          <v-text-field v-model="productData.additionalDetails.MemorySlots" label="MemorySlots" type="String"
            :rules="[v => !!v || 'Product MemorySlots is required']" />
          <v-text-field v-model="productData.additionalDetails.MemoryType" label="MemoryType" type="String"
            :rules="[v => !!v || 'Product MemoryType is required']" />
          <v-text-field v-model="productData.additionalDetails.MaxMemory" label="MaxMemory" type="String"
            :rules="[v => !!v || 'Product MaxMemory is required']" />
          <v-text-field v-model="productData.additionalDetails.OnboardGraphics" label="OnboardGraphics" type="String"
            :rules="[v => !!v || 'Product OnboardGraphics is required']" />
          <v-text-field v-model="productData.additionalDetails.OnboardAudioChipset" label="OnboardAudioChipset"
            type="String" :rules="[v => !!v || 'Product OnboardAudioChipset is required']" />
          <v-text-field v-model="productData.additionalDetails.AudioChannels" label="AudioChannels" type="String"
            :rules="[v => !!v || 'Product AudioChannels is required']" />
          <v-text-field v-model="productData.additionalDetails.ExpansionSlots" label="ExpansionSlots" type="String"
            :rules="[v => !!v || 'Product ExpansionSlots is required']" />
          <v-text-field v-model="productData.additionalDetails.Storage" label="Storage" type="String"
            :rules="[v => !!v || 'Product Storage is required']" />
          <v-text-field v-model="productData.additionalDetails.RearPanelIO" label="RearPanelIO" type="String"
            :rules="[v => !!v || 'Product RearPanelIO is required']" />
          <v-text-field v-model="productData.additionalDetails.LANChipset" label="LANChipset" type="String"
            :rules="[v => !!v || 'Product LANChipset is required']" />
          <v-text-field v-model="productData.additionalDetails.LANSpeed" label="LANSpeed" type="String"
            :rules="[v => !!v || 'Product LANSpeed is required']" />
          <v-text-field v-model="productData.additionalDetails.Dimensions" label="Dimensions" type="String"
            :rules="[v => !!v || 'Product Dimensions is required']" />
          <v-text-field v-model="productData.additionalDetails.PowerPin" label="PowerPin" type="String"
            :rules="[v => !!v || 'Product PowerPin is required']" />
          <v-select v-model="productData.additionalDetails.FormFactor" label="FormFactor"
            :items="['ATX', 'Micro-ATX', 'Mini-ITX']" type="String"
            :rules="[v => !!v || 'Product FormFactor is required']" />
          <v-text-field v-model="productData.additionalDetails.Warranty" label="Warranty" type="String"
            :rules="[v => !!v || 'Product Warranty is required']" />
        </template>

        <template v-if="selectedCategoryAdd === 'psu'">
          <v-text-field v-model="productData.additionalDetails.Brand" label="Brand" type="String"
            :rules="[v => !!v || 'Product Brand is required']" />
          <v-text-field v-model="productData.additionalDetails.EnergyEfficient" label="EnergyEfficient default Unknown"
            type="String" :rules="[v => !!v || 'Product EnergyEfficient is required']" />
          <v-text-field v-model="productData.additionalDetails.Modular" label="Modular" type="String"
            :rules="[v => !!v || 'Product Modular is required']" />
          <v-text-field v-model="productData.additionalDetails.ContinuousPowerW" label="ContinuousPowerW" type="String"
            :rules="[v => !!v || 'Product ContinuousPowerW is required']" />
          <v-text-field v-model="productData.additionalDetails.FormFactor" label="FormFactor" type="String"
            :rules="[v => !!v || 'Product FormFactor is required']" />
          <v-text-field v-model="productData.additionalDetails.InputVoltage" label="InputVoltage default Unknown"
            type="String" :rules="[v => !!v || 'Product InputVoltage is required']" />
          <v-text-field v-model="productData.additionalDetails.InputCurrent" label="InputCurrent default Unknown"
            type="String" :rules="[v => !!v || 'Product InputCurrent is required']" />
          <v-text-field v-model="productData.additionalDetails.InputFrequency" label="InputFrequency default Unknown"
            type="String" :rules="[v => !!v || 'Product InputFrequency is required']" />
          <v-text-field v-model="productData.additionalDetails.MBConnector" label="MBConnector" type="String"
            :rules="[v => !!v || 'Product MBConnector is required']" />
          <v-text-field v-model="productData.additionalDetails.CPUConnector" label="CPUConnector" type="String"
            :rules="[v => !!v || 'Product CPUConnector is required']" />
          <v-text-field v-model="productData.additionalDetails.PCIeConnector" label="PCIeConnector" type="String"
            :rules="[v => !!v || 'Product PCIeConnector is required']" />
          <v-text-field v-model="productData.additionalDetails.SATAConnector" label="SATAConnector" type="String"
            :rules="[v => !!v || 'Product SATAConnector is required']" />
          <v-text-field v-model="productData.additionalDetails.FanSize" label="FanSize default 120 mm" type="String"
            :rules="[v => !!v || 'Product FanSize is required']" />
          <v-text-field v-model="productData.additionalDetails.Dimensions" label="Dimensions default Unknown"
            type="String" :rules="[v => !!v || 'Product Dimensions is required']" />
          <v-text-field v-model="productData.additionalDetails.Protections" label="Protections default Unknown"
            type="String" :rules="[v => !!v || 'Product Protections is required']" />
          <v-text-field v-model="productData.additionalDetails.Warranty" label="Warranty" type="String"
            :rules="[v => !!v || 'Product Warranty is required']" />
        </template>

        <template v-if="selectedCategoryAdd === 'case'">
          <v-text-field v-model="productData.additionalDetails.Brand" label="Brand default Unknown" type="String"
            :rules="[v => !!v || 'Product Brand is required']" />
          <v-text-field v-model="productData.additionalDetails.Model" label="Model" type="String"
            :rules="[v => !!v || 'Product Model is required']" />
          <v-text-field v-model="productData.additionalDetails.FormFactor" label="FormFactor" type="String"
            :rules="[v => !!v || 'Product FormFactor is required']" />
          <v-text-field v-model="productData.additionalDetails.MainboardSupport" label="MainboardSupport" type="String"
            :rules="[v => !!v || 'Product MainboardSupport is required']" />
          <v-text-field v-model="productData.additionalDetails.VGASupport" label="VGASupport" type="String"
            :rules="[v => !!v || 'Product VGASupport is required']" />
          <v-text-field v-model="productData.additionalDetails.Color" label="Color" type="String"
            :rules="[v => !!v || 'Product Color is required']" />
          <v-text-field v-model="productData.additionalDetails.CPUCoolerSupport" label="CPUCoolerSupport" type="String"
            :rules="[v => !!v || 'Product CPUCoolerSupport is required']" />
          <v-text-field v-model="productData.additionalDetails.PowerSupplySupport" label="PowerSupplySupport"
            type="String" :rules="[v => !!v || 'Product PowerSupplySupport is required']" />
          <v-text-field v-model="productData.additionalDetails.FrontIO" label="FrontIO default Unknown" type="String"
            :rules="[v => !!v || 'Product FrontIO is required']" />
          <v-text-field v-model="productData.additionalDetails.ExpansionSlots" label="ExpansionSlots" type="String"
            :rules="[v => !!v || 'Product ExpansionSlots is required']" />
          <v-text-field v-model="productData.additionalDetails.DriveBaysSupport" label="DriveBaysSupport" type="String"
            :rules="[v => !!v || 'Product DriveBaysSupport is required']" />
          <v-text-field v-model="productData.additionalDetails.FanInstallment" label="FanInstallment default Unknown"
            type="String" :rules="[v => !!v || 'Product FanInstallment is required']" />
          <v-text-field v-model="productData.additionalDetails.FanSupportFront" label="FanSupportFront default Unknown"
            type="String" :rules="[v => !!v || 'Product FanSupportFront is required']" />
          <v-text-field v-model="productData.additionalDetails.FanSupportTop" label="FanSupportTop default Unknown"
            type="String" :rules="[v => !!v || 'Product FanSupportTop is required']" />
          <v-text-field v-model="productData.additionalDetails.FanSupportSide" label="FanSupportSide default Unknown"
            type="String" :rules="[v => !!v || 'Product FanSupportSide is required']" />
          <v-text-field v-model="productData.additionalDetails.FanSupportRear" label="FanSupportRear default Unknown"
            type="String" :rules="[v => !!v || 'Product FanSupportRear is required']" />
          <v-text-field v-model="productData.additionalDetails.FanSupportBottom"
            label="FanSupportBottom default Unknown" type="String"
            :rules="[v => !!v || 'Product FanSupportBottom is required']" />
          <v-text-field v-model="productData.additionalDetails.MAXRadiatorSupport"
            label="MAXRadiatorSupport default Unknown" type="String"
            :rules="[v => !!v || 'Product MAXRadiatorSupport is required']" />
          <v-text-field v-model="productData.additionalDetails.RadiatorSupportFront"
            label="RadiatorSupportFront default Unknown" type="String"
            :rules="[v => !!v || 'Product RadiatorSupportFront is required']" />
          <v-text-field v-model="productData.additionalDetails.RadiatorSupportTop"
            label="RadiatorSupportTop default Unknown" type="String"
            :rules="[v => !!v || 'Product RadiatorSupportTop is required']" />
          <v-text-field v-model="productData.additionalDetails.RadiatorSupportSide"
            label="RadiatorSupportSide default Unknown" type="String"
            :rules="[v => !!v || 'Product RadiatorSupportSide is required']" />
          <v-text-field v-model="productData.additionalDetails.RadiatorSupportRear"
            label="RadiatorSupportRear default Unknown" type="String"
            :rules="[v => !!v || 'Product RadiatorSupportRear is required']" />
          <v-text-field v-model="productData.additionalDetails.RadiatorSupportBottom"
            label="RadiatorSupportBottom default Unknown" type="String"
            :rules="[v => !!v || 'Product RadiatorSupportBottom is required']" />
          <v-text-field v-model="productData.additionalDetails.Accessories" label="Accessories default Unknown"
            type="String" :rules="[v => !!v || 'Product Accessories is required']" />
          <v-text-field v-model="productData.additionalDetails.DimensionsWxDxH" label="DimensionsWxDxH default Unknown"
            type="String" :rules="[v => !!v || 'Product DimensionsWxDxH is required']" />
          <v-text-field v-model="productData.additionalDetails.Weight" label="Weight default Unknown" type="String"
            :rules="[v => !!v || 'Product Weight is required']" />
          <v-text-field v-model="productData.additionalDetails.Warranty" label="Warranty" type="String"
            :rules="[v => !!v || 'Product Warranty is required']" />
        </template>

        <template v-if="selectedCategoryAdd === 'm2'">
          <v-text-field v-model="productData.additionalDetails.Brand" label="Brand default Unknown" type="String"
            :rules="[v => !!v || 'Product Brand is required']" />
          <v-text-field v-model="productData.additionalDetails.FormFactor" label="FormFactor" type="String"
            :rules="[v => !!v || 'Product FormFactor is required']" />
          <v-text-field v-model="productData.additionalDetails.Capacity" label="Capacity" type="String"
            :rules="[v => !!v || 'Product Capacity is required']" />
          <v-text-field v-model="productData.additionalDetails.Interface" label="Interface" type="String"
            :rules="[v => !!v || 'Product Interface is required']" />
          <v-text-field v-model="productData.additionalDetails.ReadSpeed" label="ReadSpeed default Unknown"
            type="String" :rules="[v => !!v || 'Product ReadSpeed is required']" />
          <v-text-field v-model="productData.additionalDetails.WriteSpeed" label="WriteSpeed default Unknown"
            type="String" :rules="[v => !!v || 'Product WriteSpeed is required']" />
          <v-text-field v-model="productData.additionalDetails.Warranty" label="Warranty" type="String"
            :rules="[v => !!v || 'Product Warranty is required']" />
        </template>

        <v-btn color="green" class="ml-auto d-block" @click="addProduct">
          <v-icon left>
            mdi-content-save
          </v-icon> Save Product
        </v-btn>
      </v-form>
    </v-card>
  </v-container>

  <v-container v-else />
</template>

<script setup>
import { ref, onMounted, computed } from "vue";
import { useRoute, useRouter } from "vue-router";
import authService from "@/services/AuthService";
import adminService from "@/services/AdminService";
import { mdiConsoleNetwork } from "@mdi/js";

// value
const selectedItem = ref("profile");
const profileImage = ref("");
const page = ref("0");
const isVisit = ref(false);
const router = useRouter();
const uploading = ref(false);

// Menu Navigation Drawer
const items = [
  { text: "My Profile", icon: "mdi-account", value: "profile" },
  { text: "List Users", icon: "mdi-folder", value: "listUser" },
  { text: "Check Stock", icon: "mdi-clipboard-list", value: "checkStock" },
  { text: "Add Stock", icon: "mdi-plus", value: "addStock" }
];

const username = ref("");
const email = ref("");
const status = ref("")
onMounted(async () => {
  await loadUserFromServer();
  if ((isVisit.value == false)) {
    router.push("/");
  }
  await loadUsers()
  await loadProducts()
  console.log(status.value)
});

// Function
const loadUserFromServer = async () => {
  try {
    const user = await authService.loadUserFromServer();
    if (user) {
      isVisit.value = true;
      username.value = user.username;
      email.value = user.email;
      profileImage.value = user.profileImage || "";
      status.value = user.status
    }
    if (status.value === 'Customer') {
      router.push('/')
    }
  } catch (error) {
    alert("Please Login again");
    isVisit.value = false;
    await logout();
  }
};

// Upload Image
const uploadImage = async (event) => {
  const file = event.target.files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.readAsDataURL(file);

  reader.onload = async () => {
    try {
      uploading.value = true;
      const newProfileImage = await authService.uploadProfileImage(
        email.value,
        reader.result
      );
      profileImage.value = newProfileImage; // Update without reloading
      setTimeout(() => {
        window.location.reload();
      }, 100);
    } catch (error) {
      console.error("Upload error:", error);
      alert("Upload failed. Please try again.");
    } finally {
      uploading.value = false;
    }
  };
};

// load User
const searchUser = ref("");
const usernameUser = ref([])
const filteredUsers = computed(() => {
  if (!searchUser.value) {
    return usernameUser.value;
  }
  return usernameUser.value.filter((user) =>
    user.username.toLowerCase().includes(searchUser.value.toLowerCase()) ||
    user.email.toLowerCase().includes(searchUser.value.toLowerCase())
  );
});
const headers = ref([
  { text: "🔢 ID", value: "_id" },
  { text: "👤 Username", value: "username" },
  { text: "📧 Email", value: "email" },
  { text: "⚙️ Actions", value: "actions", sortable: false }
]);

const loadUsers = async () => {
  try {
    const response = await adminService.getUsers();
    usernameUser.value = response
  } catch (error) {
    console.error("Error loading users:", error);
  }
};

const deleteUsers = async (email) => {
  if (confirm("Are you sure you want to delete this user?")) {
    try {
      const response = await adminService.deleteUser(email);
      usernameUser.value = usernameUser.value.filter(user => user.email !== email);
    } catch (error) {
      console.error("Error deleting user:", error);
    }
  }
};


// Load Computer
const selectedCategory = ref("cpu");
const search = ref("");

const filteredProducts = computed(() => {
  if (!search.value) {
    return products.value[selectedCategory.value] || []; // Show All product
  }
  return (products.value[selectedCategory.value] || []).filter((item) =>
    item.name.toLowerCase().includes(search.value.toLowerCase()) ||  // serch from product
    item.price.toString().includes(search.value) // serch from price
  );
});

const categories = [
  { text: "CPU", value: "cpu" },
  { text: "Mainboard", value: "mainboard" },
  { text: "GPU", value: "gpu" },
  { text: "RAM", value: "ram" },
  { text: "PSU", value: "psu" },
  { text: "M.2 Storage", value: "m2" },
  { text: "Case", value: "case" },
];

const products = ref({
  cpu: [],
  mainboard: [],
  gpu: [],
  ram: [],
  psu: [],
  m2: [],
  case: [],
});

const headersProduct = ref([
  { text: "🖼 Image", value: "img" },
  { text: "🆔 ID", value: "_id" },
  { text: "📦 Name", value: "name" },
  { text: "💲 Price", value: "price" },
  { text: "⚙️ Actions", value: "actions", sortable: false }
]);


const loadProducts = async () => {
  try {
    const response = await adminService.getAllProducts();
    products.value = response
    console.log("haha", products.value)
  }
  catch (error) {
    console.error("Error loading products:", error);
  }
}


const deleteProducts = async (id, categories) => {
  if (confirm("Are you sure you want to delete this product?")) {
    try {
      const response = await adminService.deleteProducts(id, categories);
      console.log(id, categories)
      products.value[categories] = products.value[categories].filter(product => product._id !== id);
    }
    catch (error) {
      console.error("Error deleting product:", error);
    }
  }
}

// Add Computer
const form = ref(null)
const selectedCategoryAdd = ref("") // storage categories
const categoriesAdd = ["cpu", "gpu", "ram", "mainboard", "psu", "case", "m2"]; //type categories
const productData = ref({      //Data product
  name: "",
  price: "",
  img: "",
  additionalDetails: {},
})

const updateFields = () => {
  productData.value = {
    name: "",
    price: "",
    img: "",
    additionalDetails: {},
  }

  switch (selectedCategoryAdd.value) {
    case "cpu":
      productData.value.additionalDetails = {
        Brand: "",
        Series: "",
        ProcessorNumber: "",
        SocketType: "",
        Cores: "",
        Threads: "",
        BaseFrequency: "",
        MaxTurboFrequency: "",
        L2Cache: "",
        L3Cache: "",
        GraphicsModels: "N/A",
        Bit64Support: "N/A",
        CPUCooler: "Yes",
        MaximumTurboPower: "N/A",
        Warranty: "",
      }
      break;
    case "gpu":
      productData.value.additionalDetails = {
        Brands: "",
        GPUSeries: "",
        GPUModel: "",
        MemorySize: "",
        MemoryType: "GDDR6",
        BusStandard: "",
        CUDA_Cores: "",
        MemoryInterface: "",
        BoostClock: "",
        BaseClock: "N/A",
        MemoryClock: "",
        MaxDigitalResolution: "Unknown",
        HDMIPort: "",
        DisplayPort: "",
        CoolerFan: "Unknown",
        PowerConnector: "N/A",
        PowerRequirement: "",
        Dimension: "",
        Warranty: "",
      }
      break;
    case "ram":
      productData.value.additionalDetails = {
        Brand: "",
        MemorySeries: "",
        MemoryCapacity: "",
        Speed: "Unknown",
        MemoryType: "",
        CasLatency: "Unknown",
        TestedLatency: "Unknown",
        SPDVoltage: "Unknown",
        MemoryColor: "",
        Warranty: "",
      }
      break;
    case "mainboard":
      productData.value.additionalDetails = {
        Brands: "",
        CPUSupport: "Unknown",
        CPUSocket: "",
        Chipset: "",
        MemorySlots: "",
        MemoryType: "",
        MaxMemory: "",
        OnboardGraphics: "",
        OnboardAudioChipset: "",
        AudioChannels: "",
        ExpansionSlots: "",
        Storage: "",
        RearPanelIO: "",
        LANChipset: "",
        LANSpeed: "",
        Dimensions: "",
        PowerPin: "",
        FormFactor: "",
        Warranty: "",
      }
      break;
    case "psu":
      productData.value.additionalDetails = {
        Brand: "",
        EnergyEfficient: "Unknown",
        Modular: "",
        ContinuousPowerW: "",
        FormFactor: "",
        InputVoltage: "Unknown",
        InputCurrent: "Unknown",
        InputFrequency: "Unknown",
        MBConnector: "",
        CPUConnector: "",
        PCIeConnector: "",
        SATAConnector: "",
        FanSize: "120 mm",
        Dimensions: "Unknown",
        Protections: "Unknown",
        Warranty: "",
      }
      break;
    case "case":
      productData.value.additionalDetails = {
        Brand: "Unknown",
        Model: "",
        FormFactor: "",
        MainboardSupport: "",
        VGASupport: "",
        Color: "",
        CPUCoolerSupport: "",
        PowerSupplySupport: "",
        FrontIO: "Unknown",
        ExpansionSlots: "",
        DriveBaysSupport: "",
        FanInstallment: "Unknown",
        FanSupportFront: "Unknown",
        FanSupportTop: "Unknown",
        FanSupportSide: "Unknown",
        FanSupportRear: "Unknown",
        FanSupportBottom: "Unknown",
        MAXRadiatorSupport: "Unknown",
        RadiatorSupportFront: "Unknown",
        RadiatorSupportTop: "Unknown",
        RadiatorSupportSide: "Unknown",
        RadiatorSupportRear: "Unknown",
        RadiatorSupportBottom: "Unknown",
        Accessories: "Unknown",
        DimensionsWxDxH: "Unknown",
        Weight: "Unknown",
        Warranty: "",
      }
      break;
    case "m2":
      productData.value.additionalDetails = {
        Brand: "Unknown",
        FormFactor: "",
        Capacity: "",
        Interface: "",
        ReadSpeed: "Unknown",
        WriteSpeed: "Unknown",
        Warranty: "",
      }
  }
}

const addProduct = async () => {
  try {
    const valid = await form.value.validate();
    console.log("Validation result:", valid);
    console.log("HAHA ", selectedCategoryAdd.value)
    if (!valid) {
      alert("Please fill everything");
      return;
    }
    const response = await adminService.addProducts(selectedCategoryAdd.value, productData.value)
    console.log(selectedCategoryAdd.value, " ", productData.value)
    console.log(response)
    alert(response.message)
    productData.value = { name: "", price: "", img: "", additionalDetails: {} }
    setTimeout(() => {
      window.location.reload();
    }, 100);
  } catch (error) {
    alert(error.message)
    console.error("Error adding product:", error);
  }
}


</script>

<style>
.text-center {
  text-align: center;
}

.upload-btn {
  position: absolute;
  left: 730px;
  overflow: hidden;
}

.file-input {
  position: absolute;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  opacity: 0;
  cursor: pointer;
}

.bk {
  background-color: aquamarine;
}


/* New */
.profile-name {
  font-size: 54px;
  font-weight: 900;
  position: relative;
  display: inline-block;
  line-height: 1.2;
  color: white;
}

.underline-highlight {
  position: absolute;
  width: 300px;
  height: 10px;
  background-color: #00c58e;
  bottom: 0;
  left: 0;
  z-index: -1;
  border-radius: 8px;
  transition: width 0.3s ease;
}

.profile-title {
  font-size: 26px;
  font-weight: 400;
  color: #cccccc;
}

.email-verified {
  background-color: #1e1e1e;
  padding: 10px 18px;
  border-radius: 10px;
  width: fit-content;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.3);
}

.verified-text {
  font-size: 16px;
  color: #d0f0c0;
  font-weight: 500;
}

.profile-box {
  background-color: #263238;
  padding: 20px;
  border-radius: 24px;
  box-shadow: 10px 10px 0px rgba(0, 0, 0, 0.4);
  display: flex;
  justify-content: center;
  align-items: center;
}

.profile-img {
  width: 260px;
  height: 260px;
  object-fit: cover;
  border-radius: 16px;
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.4);
}
</style>
