import React, {useEffect, useState, useImperativeHandle, useRef} from 'react'
import Taro, {useDidShow, useRouter} from '@tarojs/taro'
import { View, Image, Text , Swiper, SwiperItem, Button } from '@tarojs/components'
import { AtFloatLayout } from "taro-ui"
import './detail.scss'

interface IImgArray {
  picture: string,
  id: number
}
interface IDetailInfo {
  name: string,
  imgs: Array<IImgArray>,
  sell_price: number,
  line_price: number,
  remark: string,
  sale_out: number,
  detail: Array<string>,

}
// 轮播图
const DetailSwiper = (prop: any) => {
  const {goodsDetail: {imgs}} = prop
  return (
    <View className='detail'>
      <Swiper
        className='swiper'
        indicatorColor='#999'
        indicatorActiveColor='#333'
        circular
        indicatorDots
        autoplay
      >
        {imgs.map((item: IImgArray, i: string) => {
        return(
          <SwiperItem key={i} data-url={item.picture}
            onClick={prop.previewImg.bind(null, 1)}
          >
            <View className='demo-text-1'>
              <Image className='img' src={item.picture}></Image>
            </View>
          </SwiperItem>
        )
        })}
      </Swiper>
    </View>
  )
}
// 详情
const DetailInfo = (prop: any) => {
  const {goodsDetail: {sell_price, line_price, name, remark, sale_out}} = prop;
  return (
    <View className='goods-info'>
      <View className='price'>
        <View className='sell_price'>¥{sell_price}</View>
        <View className='line_price'>¥{line_price}</View>
      </View>
      <View className='name'>{name}</View>
      {remark ? <View className='remark'>{remark}</View> : ''}
      <View className='sale-out'>月销量 {sale_out}</View>
    </View>
  )
}
// 商品详情图
const DetailImage = (prop: any) => {
  const {goodsDetail: {detail}} = prop;
  return (
    <View className='goods-image'>
      <View className='label'>商品详情</View>
      <View className='item'>
        {detail.map((item: string, i: string) => <Image data-url={item} onClick={prop.previewImg.bind(null, 2)} src={item} mode='aspectFill' key={i}></Image>)}
      </View>
    </View>
  )
}
// 底部按钮
const Footer = (prop: any) => {
  console.log(prop);

  return (
    <View className='footer'>
      <Button className='btn' onClick={prop.goBuy}>立即购买</Button>
    </View>
  )
}
// 选择数量弹窗
const SelectPopup = (prop: any) => {
  const {cRef} = prop;
  const [isOpened, setIsOpened] = useState(false);
  // 关闭弹窗
  const handleClose = () => {
    setIsOpened(false)
  }
  // 此处注意useImperativeHandle方法的的第一个参数是目标元素的ref引用
  useImperativeHandle(cRef, () => ({
    // openPopop 就是暴露给父组件的方法
    openPopop: (newVal: React.SetStateAction<boolean>) => {
      setIsOpened(newVal);
    }
  }));
  return (
    <AtFloatLayout
      isOpened={isOpened}
      onClose={handleClose}
    >
      这是内容区 随你怎么写这是内容区 随你怎么写这是内容区 随你怎么写这是内容区
      随你怎么写这是内容区 随你怎么写这是内容区 随你怎么写
    </AtFloatLayout>
  )

}
const Detail = () => {
  const goodsDetail: IDetailInfo = {
    name: "商品名称",
    imgs: [
      {
        picture: "https://cos-image-test.erunli.com/public/2021/01/28/3d6bfb54e041ea793cca30fa57b17006.png",
        id: 1
      },
      {
        picture: "https://cos-image-test.erunli.com/public/2021/01/28/3d6bfb54e041ea793cca30fa57b17006.png",
        id: 2
      }
    ],
    sell_price: 34.90,
    line_price: 99.87,
    remark: "*本商品为特惠商品，一经购买不支持退换",
    sale_out: 1290,
    detail: ["https://cos-image-test.erunli.com/public/2021/01/28/3d6bfb54e041ea793cca30fa57b17006.png", "https://cos-image-test.erunli.com/public/2021/01/28/3d6bfb54e041ea793cca30fa57b17006.png"]

  }
  const childRef = useRef<any>();
  const openPopup = () => {
    childRef.current.openPopop(true);
  }
  // 预览图片
  const previewImg = (type: number, e:any) => {
    const { currentTarget: { dataset: {url} } } = e
    const {imgs, detail} = goodsDetail
    Taro.previewImage({
      current: url, // 当前显示图片的http链接
      urls: type == 1 ? imgs.map(ele => ele.picture) : detail
    })
  }
  // 立即购买
  const goBuy = () => {
    // 判断是否需要打开弹窗
    openPopup()
  }
  return (
    <View className='page-goods-detail'>
      <DetailSwiper
        goodsDetail={goodsDetail}
        previewImg={previewImg}
      >
      </DetailSwiper>
      <DetailInfo goodsDetail={goodsDetail}>
      </DetailInfo>
      <DetailImage goodsDetail={goodsDetail} previewImg={previewImg}></DetailImage>
      <Footer goodsDetail={goodsDetail} goBuy={goBuy} ></Footer>
      <SelectPopup cRef={childRef} ></SelectPopup>
    </View>

  )
}
export default Detail

