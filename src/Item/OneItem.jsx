import React, { useContext, useEffect, useState } from "react";
import "./OneItem.css";
import { IoMdTime } from "react-icons/io";
import { BiSolidDish } from "react-icons/bi";
import { IoIosPricetag } from "react-icons/io";
import Header from "../Header/Header";
import { PostList } from "../Store/AllStore";
import Loder from "../Loder/Loder";
import { MdEnergySavingsLeaf } from "react-icons/md";
import { PieChart } from "@mui/x-charts/PieChart";
import { BarChart } from "@mui/x-charts/BarChart";
import Skeleton from "@mui/material/Skeleton";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import SuggestItem from "../SuggestItem/SuggestItem";

import { dataset, valueFormatter } from "./ChartData";
import Comment from "../Comment/Comment";
import Footer from "../Footer/Footer";

const OneItem = () => {
  const [items, setItems] = useState(null);
  const [ingredientImageLoaded, setIngredientImageLoaded] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);
  const { reload, setReload, loadingContent, setloadingContent } =
    useContext(PostList);

  useEffect(() => {
    const resultItem = sessionStorage.getItem("ViewItem");
    if (resultItem) {
      try {
        const parsedItem = JSON.parse(resultItem);
        setItems(parsedItem);
        setTimeout(() => {
          setloadingContent(false);
        }, 1000);
      } catch (error) {
        console.error("Error parsing ViewItem from sessionStorage", error);
        setloadingContent(false);
      }
    }
  }, [reload]);

  if (!items) {
    return (
      <div className="spinner">
        <Loder loading={loadingContent} />
      </div>
    );
  }

  const vitaminRows = items.payload.nutrition.nutrients
    .filter((item) => /^Vitamin/.test(item.name))
    .map((item) => ({
      name: item.name,
      amount: item.amount,
      unit: item.unit,
      percent: item.percentOfDailyNeeds,
    }));

  return loadingContent ? (
    <div className="spinner">
      <Loder loading={loadingContent} />
    </div>
  ) : (
    <>
      <Header />
      <div className="mainItemContainer">
        <div className="onePageItemContainer">
          <div className="containerLeft">
            <div className="itemImageContainer">
              {!imageLoaded && (
                <Skeleton variant="rectangular" width={500} height={400} />
              )}
              <img
                src={items.payload.information.image}
                onLoad={() => setImageLoaded(true)}
                alt="Item"
                style={{ display: imageLoaded ? "block" : "none" }}
              />
            </div>
            <div className="iconContainerItem">
              <div className="iconItem">
                <IoMdTime />
                <p>
                  Time:~{items.payload.information.readyInMinutes} minutes total
                </p>
              </div>
              <div className="iconItem">
                <BiSolidDish />
                <p>Servings: {items.payload.information.servings}</p>
              </div>
              <div className="iconItem">
                <IoIosPricetag />
                <p>
                  Cost per serving:{items.payload.information.pricePerServing}
                </p>
              </div>
            </div>
          </div>
          <div className="containerRight">
            <h4>
              {items.payload.information.title}
              <span className="caloriesButton">
                <MdEnergySavingsLeaf />
                <span>{items.payload.nutrition.calories}</span>
              </span>
            </h4>
            <div className="dishType">
              {items.payload.information.dishTypes.map((item, index) => (
                <button key={index} className="dish-button">
                  {item}
                </button>
              ))}
            </div>

            <div className="processbox">
              {/* <p>{items.payload.information.instructions}</p> */}
              <p
                dangerouslySetInnerHTML={{
                  __html: items.payload.information.summary,
                }}
              />
            </div>
          </div>
        </div>
        <div className="ingredientContainer">
          {items.payload.information.extendedIngredients?.map((item, index) => (
            <div className="ingredientImage" key={index}>
              {!ingredientImageLoaded && (
                <Skeleton variant="rectangular" width={100} height={100} />
              )}
              <img
                src={`https://spoonacular.com/cdn/ingredients_500x500/${item.image}`}
                alt={item.name}
                onLoad={() => setIngredientImageLoaded(true)}
                style={{ display: ingredientImageLoaded ? "block" : "none" }}
              />
              <p>{item.name}</p>
            </div>
          ))}
        </div>

        <div className="processForMade">
          {items.payload.information.analyzedInstructions[0].steps.map(
            (item, index) => (
              <div className="processForMadeInside" key={index}>
                <p>{item.step}</p>
              </div>
            )
          )}
        </div>
        <Comment />
        <SuggestItem />
        <div className="tableNutrition">
          <TableContainer component={Paper}>
            <Table
              sx={{ minWidth: 650 }}
              size="small"
              aria-label="a dense table"
            >
              <TableHead>
                <TableRow>
                  <TableCell>Dessert (100g serving)</TableCell>
                  <TableCell align="right">Amount</TableCell>
                  <TableCell align="right">Unit&nbsp;(g)</TableCell>
                  <TableCell align="right">Persentage&nbsp;(g)</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {vitaminRows.map((row) => (
                  <TableRow
                    key={row.name}
                    sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                  >
                    <TableCell component="th" scope="row">
                      {row.name}
                    </TableCell>
                    <TableCell align="right">{row.amount}</TableCell>
                    <TableCell align="right">{row.unit}</TableCell>
                    <TableCell align="right">{row.percent}%</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </div>

        <div className="chartContainer">
          <div className="nutrientsDetails">
            <PieChart
              series={[
                {
                  data: items.payload.nutrition.nutrients
                    .filter((item) =>
                      [
                        "Calories",
                        "Fat",
                        "Carbohydrates",
                        "Sugar",
                        "Calcium",
                        "Protein",
                        "Fiber",
                      ].includes(item.name)
                    )
                    .map((result) => ({
                      value: result.amount,
                      label: result.name,
                    })),
                },
              ]}
              width={200}
              height={200}
            />
          </div>

          <div className="nutritionGoodBarChart">
            <BarChart
              className="barchartInside"
              height={300}
              width={400}
              series={[
                {
                  data: items.payload?.nutrition?.good?.map(
                    (element) => element.percentOfDailyNeeds
                  ),
                  label: "pv",
                  id: "pvId",
                },
              ]}
              xAxis={[
                {
                  data: items.payload?.nutrition?.good?.map(
                    (element) => element.title
                  ),
                  scaleType: "band",
                },
              ]}
              yAxis={[{ width: 50 }]}
            />
          </div>

          <div className="nutrientsVittamin">
            <PieChart
              series={[
                {
                  data: items.payload.nutrition.nutrients
                    .filter((item) => /^Vitamin/.test(item.name))
                    .map((result) => ({
                      value: result.amount,
                      label: result.name,
                    })),
                },
              ]}
              width={200}
              height={200}
            />
          </div>
        </div>
      </div>
      <Footer></Footer>
    </>
  );
};

export default OneItem;
